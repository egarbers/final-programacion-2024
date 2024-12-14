import mongoose from 'mongoose'

const { Schema } = mongoose

const positionSchema = new Schema({
    name: { type: String, required: true, lowercase: false, trim: true },
    areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    createdAt: Date,
    updatedAt: Date,
});

const Position = mongoose.model('Position', positionSchema);

export default Position
