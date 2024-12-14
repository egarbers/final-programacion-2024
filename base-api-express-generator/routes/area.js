import express from 'express'

import Area from '../schemas/area.js'

const router = express.Router()

router.get('/', getAllAreas)
router.get('/organigram', getAllAreasOrganigram)
router.get('/:id', getAreaById)
router.get('/:id/departments', getDepartmentsAreaById)
router.post('/', createArea)
router.put('/:id', updateArea)
router.delete('/:id', deleteArea)

async function getAllAreas(req, res, next) {
    console.log('getAllAreas by user', req.user._id);
    try {
        // Usamos populate para obtener los departamentos relacionados con las áreas
        const areas = await Area.find()
            .populate({
                path: 'departments', // Nombre del campo de la relación
                select: 'name', // Campos que queremos traer del departamento
            });

        res.send(areas); // Enviamos las áreas con los departamentos
    } catch (err) {
        next(err);
    }
}

async function getAllAreasOrganigram(req, res, next) {
    console.log('getAllAreas by user', req.user._id);
    try {
        // Usamos aggregate para obtener áreas, departamentos, posiciones y usuarios en una sola consulta
        const areas = await Area.aggregate([
            {
                // Primer lookup: Obtener los departamentos relacionados con el área
                $lookup: {
                    from: 'departments', // Nombre de la colección de departamentos
                    localField: '_id', // Relacionamos el _id del área con el campo areaId en departamentos
                    foreignField: 'areaId',
                    as: 'departments', // El resultado se guardará en el campo "departments"
                },
            },
            {
                // Usamos unwind para descomponer los departamentos y permitir el siguiente lookup sin afectar la agrupación
                $unwind: '$departments',
            },
            {
                // Segundo lookup: Obtener las posiciones relacionadas con cada departamento
                $lookup: {
                    from: 'positions', // Nombre de la colección de posiciones
                    localField: 'departments._id', // Relacionamos el _id del departamento con el campo departmentId en las posiciones
                    foreignField: 'departmentId',
                    as: 'departments.positions', // El resultado se guardará en el campo "positions"
                },
            },
            {
                // Aseguramos que cada posición tenga su nombre
                $unwind: '$departments.positions', // Descomponemos las posiciones para acceder a su nombre
            },
            {
                // Tercer lookup: Obtener los usuarios asignados a cada posición
                $lookup: {
                    from: 'users', // Nombre de la colección de usuarios
                    localField: 'departments.positions._id', // Relacionamos el _id de la posición con el campo positionId en los usuarios
                    foreignField: 'position',
                    as: 'departments.positions.users', // Los usuarios se guardarán en el campo "users" dentro de cada posición
                },
            },
            {
                // Agrupamos de nuevo por el _id del área para mantener todos los departamentos con sus posiciones y usuarios
                $group: {
                    _id: '$_id', // Agrupamos por el _id del área
                    name: { $first: '$name' }, // Traemos el nombre del área
                    departments: {
                        $push: {
                            _id: '$departments._id', // Incluimos el id del departamento
                            name: '$departments.name', // Traemos el nombre del departamento
                            positions: {
                                _id: '$departments.positions._id', // Incluimos el id de la posición
                                name: '$departments.positions.name', // Traemos el nombre de la posición
                                users: '$departments.positions.users', // Los usuarios asignados a la posición
                            },
                        },
                    },
                },
            },
            {
                // Ordenamos los resultados por el nombre del área (campo 'name') en orden ascendente
                $sort: { name: 1 }, // 1 para ascendente, -1 para descendente
            },
        ]);

        // Devolvemos las áreas con sus departamentos, posiciones y usuarios asociados
        res.send(areas);
    } catch (err) {
        next(err);
    }
}

async function getAreaById(req, res, next) {
    console.log('getAreaById with id: ', req.params.id)

    if (!req.params.id) {
        res.status(500).send('The param id is not defined')
    }

    try {
        const area = await Area.findById(req.params.id);

        if (!area || area.length == 0) {
            res.status(404).send('Area not found')
        }

        res.send(area)
    } catch (err) {
        next(err)
    }
}

async function getDepartmentsAreaById(req, res, next) {
    console.log('getAllAreas by user', req.user._id);
    try {
        const areas = await Area.findById(req.params.id)
            .populate({
                path: 'departments',
                select: 'name',
            });

        res.send(areas);
    } catch (err) {
        next(err);
    }
}

async function createArea(req, res, next) {
    console.log('createArea: ', req.body)

    const area = req.body

    try {
        const areaCreated = await Area.create({
            ...area
        })

        res.send(areaCreated)
    } catch (err) {
        next(err)
    }
}

async function updateArea(req, res, next) {
    console.log('updateArea with id: ', req.params.id)

    if (!req.params.id) {
        return res.status(404).send('Parameter id not found')
    }

    if (!req.isAdmin()) {
        return res.status(403).send('Unauthorized')
    }

    try {
        const areaToUpdate = await Area.findById(req.params.id)

        if (!areaToUpdate) {
            console.error('Area not found')
            return res.status(404).send('Area not found')
        }

        // This will return the previous status
        await areaToUpdate.updateOne(req.body)
        res.send(areaToUpdate)
    } catch (err) {
        next(err)
    }
}

async function deleteArea(req, res, next) {
    console.log('deleteArea with id: ', req.params.id)

    if (!req.params.id) {
        res.status(500).send('The param id is not defined')
    }

    try {
        const area = await Area.findById(req.params.id)

        if (!area) {
            res.status(404).send('User not found')
        }

        await Area.deleteOne({ _id: area._id })

        res.send(`Area deleted :  ${req.params.id}`)
    } catch (err) {
        next(err)
    }
}

export default router
