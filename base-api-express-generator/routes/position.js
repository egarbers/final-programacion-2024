import express from 'express'

import Position from '../schemas/position.js'

const router = express.Router()

router.get('/:id', getPositionsByDepartmentId)

async function getPositionsByDepartmentId(req, res, next) {
    console.log('getPositionsByDepartmentId by user ', req.user._id)
    try {
        const positions = await Position.find({ departmentId: req.params.id });
        res.send(positions)
    } catch (err) {
        next(err)
    }
}

export default router
