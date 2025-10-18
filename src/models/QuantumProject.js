import mongoose from 'mongoose';

const QuantumProjectSchema = new mongoose.Schema({
    name: String,
    scenario: String,
    algorithm_type: String,
    canvas_data: Object,
    status: String,
    created_at: { type: Date, default: Date.now },
});

export default mongoose.models.QuantumProject || mongoose.model('QuantumProject', QuantumProjectSchema);
