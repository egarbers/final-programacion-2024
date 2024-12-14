import express from 'express'

import Role from '../schemas/role.js'

const router = express.Router()

router.get('/', getAllRoles)
router.get('/:id', getRoleById)

async function getAllRoles(req, res, next) {
    console.log('getAllRoles by user ', req.user._id)
    try {
        const roles = await Role.find()
        res.send(roles)
    } catch (err) {
        next(err)
    }
}

async function getRoleById(req, res, next) {
    console.log('getRoleById with id: ', req.params.id)

    if (!req.params.id) {
        res.status(500).send('The param id is not defined')
    }

    try {
        const role = await Role.findById(req.params.id).populate('role')

        if (!role || role.length == 0) {
            res.status(404).send('User not found')
        }

        res.send(role)
    } catch (err) {
        next(err)
    }
}

export default router
