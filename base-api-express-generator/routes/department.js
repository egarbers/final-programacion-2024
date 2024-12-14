import express from 'express'

import Department from '../schemas/department.js'
import Position from '../schemas/position.js'

const router = express.Router()

router.get('/', getAllDepartments)
router.post('/', createDepartment)
router.get('/:id', getDepartmentById)
router.put('/:id', updateDepartment)
router.delete('/:id', deleteDepartment)

async function getAllDepartments(req, res, next) {
    console.log('getAllDepartments by user ', req.user._id)
    try {
        const departments = await Department.find().populate({
            path: 'positions',
            select: 'name areaId createdAt updatedAt',
        });
        res.send(departments)
    } catch (err) {
        next(err)
    }
}

async function createDepartment(req, res, next) {
    console.log('createDepartment: ', req.body);

    const department = req.body;

    try {
        // Crear el departamento
        const departmentCreated = await Department.create({
            ...department
        });

        // Crear los puestos asociados
        const headPosition = {
            name: `Jefe de ${department.name}`,
            areaId: department.areaId,
            departmentId: departmentCreated._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const employeePosition = {
            name: `Empleado de ${department.name}`,
            areaId: department.areaId,
            departmentId: departmentCreated._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const positionsCreated = await Position.insertMany([headPosition, employeePosition]);

        // Agregar referencia del jefe al departamento, si aplica
        departmentCreated.head = positionsCreated[0]._id;
        await departmentCreated.save();

        // Responder con el departamento y las posiciones creadas
        res.send({ department: departmentCreated, positions: positionsCreated });
    } catch (err) {
        next(err);
    }
}

async function getDepartmentById(req, res, next) {
    console.log('getDepartmentById with id: ', req.params.id)

    if (!req.params.id) {
        res.status(500).send('The param id is not defined')
    }

    try {
        const department = await Department.findById(req.params.id);

        if (!department || department.length == 0) {
            res.status(404).send('Department not found')
        }

        res.send(department)
    } catch (err) {
        next(err)
    }
}

async function updateDepartment(req, res, next) {
    console.log('updateDepartment with id: ', req.params.id)

    if (!req.params.id) {
        return res.status(404).send('Parameter id not found')
    }

    if (!req.isAdmin()) {
        return res.status(403).send('Unauthorized')
    }

    try {
        const departmentToUpdate = await Department.findById(req.params.id)

        if (!departmentToUpdate) {
            console.error('Department not found')
            return res.status(404).send('Department not found')
        }

        // This will return the previous status
        await departmentToUpdate.updateOne(req.body);
        const positions = await Position.find({ departmentId: req.params.id });
        
        // Actualizo los nombres de los positions
        for (const position of positions) {
            const rolePrefix = position.name.startsWith('Jefe de') ? 'Jefe de' : 'Empleado de';
            position.name = `${rolePrefix} ${req.body.name}`;
            await position.save();
        }

        res.send(departmentToUpdate)
    } catch (err) {
        next(err)
    }
}

async function deleteDepartment(req, res, next) {
    console.log('deleteDepartment with id: ', req.params.id)

    if (!req.params.id) {
        res.status(500).send('The param id is not defined')
    }

    try {
        const department = await Department.findById(req.params.id)

        if (!department) {
            res.status(404).send('Department not found')
        }

        // Elimino posiciones relacionadas al departamento
        const deletedPositions = await Position.deleteMany({ departmentId: department._id });

        await Department.deleteOne({ _id: department._id })

        res.send(`Department deleted :  ${req.params.id}`)
    } catch (err) {
        next(err)
    }
}

export default router
