import mongoose from 'mongoose'

const { Schema } = mongoose

const areaSchema = new Schema({
  name: { type: String, required: true, lowercase: false, trim: true },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
})

// Virtual field for positions
areaSchema.virtual('departments', {
    ref: 'Department',
    localField: '_id',
    foreignField: 'areaId',
});

areaSchema.set('toObject', { virtuals: true });
areaSchema.set('toJSON', { virtuals: true });
  
const Area = mongoose.model('Area', areaSchema);

export default Area
