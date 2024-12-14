import express from 'express'
import bcrypt from 'bcrypt'

import User from '../schemas/user.js'
import Role from '../schemas/role.js'
import Position from '../schemas/position.js'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.put('/:id/position', updateUserPosition)

function toDate(input) {
    if (!input) {
        return null;
    }

    const [year, month, day] = input.split('-')
    return new Date(year, month, day)
}

async function getAllUsers(req, res, next) {
    console.log('getAllUsers by user ', req.user._id)
    try {
        const users = await User.find({ isActive: true }).populate('role').populate('position')
        res.send(users)
    } catch (err) {
        next(err)
    }
}

async function getUserById(req, res, next) {
    console.log('getUser with id: ', req.params.id)

    if (!req.params.id) {
        res.status(500).send('The param id is not defined')
    }

    try {
        const user = await User.findById(req.params.id).populate('role').populate('position')

        if (!user || user.length == 0) {
            res.status(404).send('User not found')
        }

        res.send(user)
    } catch (err) {
        next(err)
    }
}

async function createUser(req, res, next) {
    console.log('createUser: ', req.body)

    const user = req.body

    try {
        const role = await Role.findOne({ _id: user.role })
        if (!role) {
            res.status(404).send('Role not found')
        }

        const passEncrypted = await bcrypt.hash(user.password, 10)

        const userCreated = await User.create({
            ...user,
            bornDate: toDate(user.bornDate),
            password: passEncrypted,
            role: role,
        })

        res.send(userCreated)
    } catch (err) {
        next(err)
    }
}

async function updateUser(req, res, next) {
    console.log('updateUser with id: ', req.params.id)

    if (!req.params.id) {
        return res.status(404).send('Parameter id not found')
    }

    if (!req.isAdmin() && req.params.id !== req.user._id) {
        return res.status(403).send('Unauthorized')
    }


    // Si se edita a si mismo, no puede modificarse su rol
    if (req.params.id == req.user._id) {
        delete req.body.role
    }

    // The email can't be updated
    delete req.body.email

    try {
        const userToUpdate = await User.findById(req.params.id)

        if (!userToUpdate) {
            console.error('User not found')
            return res.status(404).send('User not found')
        }

        if (req.body.role) {
            const newRole = await Role.findById(req.body.role)

            if (!newRole) {
                console.info('New role not found. Sending 400 to client')
                return res.status(400).end()
            }
            req.body.role = newRole._id
        }

        if (req.body.password) {
            const passEncrypted = await bcrypt.hash(req.body.password, 10)
            req.body.password = passEncrypted
        }

        // This will return the previous status
        await userToUpdate.updateOne(req.body)
        res.send(userToUpdate)
    } catch (err) {
        next(err)
    }
}

async function deleteUser(req, res, next) {
    console.log('deleteUser with id: ', req.params.id)

    if (!req.params.id) {
        res.status(500).send('The param id is not defined')
    }

    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(404).send('User not found')
        }

        await User.deleteOne({ _id: user._id })

        res.send(`User deleted :  ${req.params.id}`)
    } catch (err) {
        next(err)
    }
}

async function updateUserPosition(req, res, next) {
    console.log('updateUserPosition with id: ', req.params.id);

    if (!req.params.id) {
        return res.status(400).send('Parameter id is required');
    }

    // Verificar si el usuario es administrador
    if (!req.isAdmin()) {
        return res.status(403).send('Unauthorized: Only admins can update positionId');
    }

    const { positionId } = req.body;

    if (!positionId) {
        return res.status(400).send('positionId is required');
    }

    const newPosition = await Position.findById(positionId)

    if (!newPosition) {
        console.info('New position not found. Sending 400 to client')
        return res.status(400).end()
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Actualizar solo el campo positionId
        user.position = newPosition;
        await user.save();

        res.send({
            message: 'Position updated successfully',
            user: { id: user._id, position: user.newPosition },
        });
    } catch (err) {
        next(err);
    }
}

export default router
