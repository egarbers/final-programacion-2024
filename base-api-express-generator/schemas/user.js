import mongoose from 'mongoose'
import validate from 'mongoose-validator'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types
const emailValidator = validate({ validator: 'isEmail' })

const governmentIdTypes = ['cuil', 'cuit', 'dni', 'lc', 'le', 'pas']

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: emailValidator,
  },
  password: { type: String, required: true, select: false },
  role: { type: ObjectId, ref: 'Role', required: true },
  firstName: { type: String, required: true, lowercase: false, trim: true },
  lastName: { type: String, required: true, lowercase: false, trim: true },
  phone: { type: String, trim: true },
  governmentId: {
    type: { type: String, enum: governmentIdTypes },
    number: { type: String, trim: true },
  },
  bornDate: { type: Date },
  isActive: { type: Boolean, default: true },
  position: { type: ObjectId, ref: 'Position', required: true },
})

userSchema.index({ 'governmentId.type': 1, 'governmentId.number': 1 }, { unique: true })

userSchema.method('checkPassword', async function checkPassword(potentialPassword) {
  if (!potentialPassword) {
    return Promise.reject(new Error('Password is required'))
  }

  const isMatch = await bcrypt.compare(potentialPassword, this.password)

  return { isOk: isMatch, isLocked: !this.isActive }
})

const User = mongoose.model('User', userSchema)

export default User
