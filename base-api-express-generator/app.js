import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import statusRouter from './routes/status.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import roleRouter from './routes/role.js'
import positionRouter from './routes/position.js'
import departmentRouter from './routes/department.js'
import areaRouter from './routes/area.js'
import authentication from './middlewares/authentication.js'
import authorization from './middlewares/authorization.js'

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(authorization)

app.use('/', statusRouter)
app.use('/auth', authRouter)
app.use('/users', authentication, userRouter)
app.use('/roles', authentication, roleRouter)
app.use('/positions', authentication, positionRouter)   
app.use('/departments', authentication, departmentRouter)
app.use('/areas', authentication, areaRouter)

export default app
