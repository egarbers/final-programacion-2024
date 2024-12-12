import jwt from 'jsonwebtoken';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import Role from '../schemas/role.js';

// Define __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateUserToken(req, user) {
  const role = await Role.findById(user.role).exec();

  const payload = {
    _id: user._id,
    role: role.name,
  };

  const userResponse = {
    _id: user._id,
    role: role.name,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  // Leer la clave privada desde el archivo
  const privateKeyPath = path.join(__dirname, '../keys/private_key.pem');
  const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');

  const token = jwt.sign(payload, privateKey, {
    subject: user._id.toString(),
    issuer: 'base-api-express-generator',
    algorithm: 'RS256',
  });

  return { token, user: userResponse };
}

export default generateUserToken;
