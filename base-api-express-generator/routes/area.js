import express from 'express'
import bcrypt from 'bcrypt'

import Area from '../schemas/area.js'
import Position from '../schemas/position.js'
import Department from '../schemas/department.js'
import User from '../schemas/user.js'

const router = express.Router()

router.get('/', getAllAreas)
// router.get('/:id', getUserById)
// router.post('/', createUser)
// router.put('/:id', updateUser)
// router.delete('/:id', deleteUser)

async function getAllAreas(req, res, next) {
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
      ]);
  
      // Devolvemos las áreas con sus departamentos, posiciones y usuarios asociados
      res.send(areas);
    } catch (err) {
      next(err);
    }
  }
  
  


// async function getUserById(req, res, next) {
//   console.log('getUser with id: ', req.params.id)

//   if (!req.params.id) {
//     res.status(500).send('The param id is not defined')
//   }

//   try {
//     const user = await User.findById(req.params.id).populate('role')

//     if (!user || user.length == 0) {
//       res.status(404).send('User not found')
//     }

//     res.send(user)
//   } catch (err) {
//     next(err)
//   }
// }

// async function createUser(req, res, next) {
//   console.log('createUser: ', req.body)

//   const user = req.body

//   try {
//     const role = await Role.findOne({ _id: user.role })
//     if (!role) {
//       res.status(404).send('Role not found')
//     }

//     const passEncrypted = await bcrypt.hash(user.password, 10)

//     const userCreated = await User.create({
//       ...user,
//       bornDate: toDate(user.bornDate),
//       password: passEncrypted,
//       role: role,
//     })

//     res.send(userCreated)
//   } catch (err) {
//     next(err)
//   }
// }

// async function updateUser(req, res, next) {
//   console.log('updateUser with id: ', req.params.id)

//   if (!req.params.id) {
//     return res.status(404).send('Parameter id not found')
//   }

//   if (!req.isAdmin() && req.params.id !== req.user._id) {
//     return res.status(403).send('Unauthorized')
//   }


//   // Si se edita a si mismo, no puede modificarse su rol
//   if(req.params.id == req.user._id){
//     delete req.body.role
//   }

//   // The email can't be updated
//   delete req.body.email

//   try {
//     const userToUpdate = await User.findById(req.params.id)

//     if (!userToUpdate) {
//       console.error('User not found')
//       return res.status(404).send('User not found')
//     }

//     if (req.body.role) {
//       const newRole = await Role.findById(req.body.role)

//       if (!newRole) {
//         console.info('New role not found. Sending 400 to client')
//         return res.status(400).end()
//       }
//       req.body.role = newRole._id
//     }

//     if (req.body.password) {
//       const passEncrypted = await bcrypt.hash(req.body.password, 10)
//       req.body.password = passEncrypted
//     }

//     // This will return the previous status
//     await userToUpdate.updateOne(req.body)
//     res.send(userToUpdate)

//     // This return the current status
//     // userToUpdate.password = req.body.password
//     // userToUpdate.role = req.body.role
//     // userToUpdate.firstName = req.body.firstName
//     // userToUpdate.lastName = req.body.lastName
//     // userToUpdate.phone = req.body.phone
//     // userToUpdate.bornDate = req.body.bornDate
//     // userToUpdate.isActive = req.body.isActive
//     // await userToUpdate.save()
//     // res.send(userToUpdate)
//   } catch (err) {
//     next(err)
//   }
// }

// async function deleteUser(req, res, next) {
//   console.log('deleteUser with id: ', req.params.id)

//   if (!req.params.id) {
//     res.status(500).send('The param id is not defined')
//   }

//   try {
//     const user = await User.findById(req.params.id)

//     if (!user) {
//       res.status(404).send('User not found')
//     }

//     await User.deleteOne({ _id: user._id })

//     res.send(`User deleted :  ${req.params.id}`)
//   } catch (err) {
//     next(err)
//   }
// }

export default router
