import express from 'express'
import pkg from '../package.json' with { type: 'json' }

const router = express.Router()

router.get('/', (req, res) => {
  res.send({
    name: pkg.name,
    version: pkg.version,
    /* eslint-disable-next-line no-undef */
    enviroment: process.env.ENV,
  })
})

router.get('/status', (req, res) => {
  console.log('Responding to status request')
  res.status(200).send({ status: 'The API is up and running' })
})

export default router
