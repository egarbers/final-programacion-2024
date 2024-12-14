import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { fileURLToPath } from 'url';
import fs from 'fs'
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicKeyPath = path.join(__dirname, '../keys/public_key.pem');
const publicKey = fs.readFileSync(publicKeyPath, 'utf-8');

function getToken(req, next) {
    const TOKEN_REGEX = /^\s*Bearer\s+(\S+)/g
    const matches = TOKEN_REGEX.exec(req.headers.authorization)

    if (!matches) {
        return next(new createError.Unauthorized())
    }

    const [, token] = matches
    return token
}

function authentication(req, res, next) {
    if (!req.headers.authorization) {
        console.error('Missing authorization header')
        return next(new createError.Unauthorized())
    }

    const token = getToken(req, next)

    try {
        req.user = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            issuer: 'base-api-express-generator',
        })

        if (!req.user || !req.user._id || !req.user.role) {
            console.error('Error authenticating malformed JWT')
            return next(new createError.Unauthorized())
        }

        console.info(`User ${req.user._id} authenticated`)

        next(null)
    } catch (err) {
        if (err.message === 'invalid algorithm' || err.message === 'invalid signature') {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            console.error(`Suspicious access attempt from ip=${ip} ${token}`)
        }
        if (err.name === 'TokenExpiredError') {
            console.error('Expired token, sending 401 to client')
            return res.sendStatus(401)
        }
        return next(new createError.Unauthorized(err))
    }
}

export default authentication
