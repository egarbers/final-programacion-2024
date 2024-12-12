import mongoose from 'mongoose'

const { Schema } = mongoose

const departmentSchema = new Schema({
  name: { type: String, required: true, lowercase: false, trim: true },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'Position' },
})

// Virtual field for positions
departmentSchema.virtual('positions', {
    ref: 'Position',
    localField: '_id',
    foreignField: 'departmentId',
});

departmentSchema.set('toObject', { virtuals: true });
departmentSchema.set('toJSON', { virtuals: true });
  
const Department = mongoose.model('Department', departmentSchema);

export default Department
