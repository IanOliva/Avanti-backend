import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema({
    donator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
    paymentMethod: {type: String, required: true, enum: ['cash', 'card', 'paypal'], default: 'cash'},
    paymentAmount: {type: Number, required: true},
    contributionDate: {type: Date, default: Date.now},
});

const Contribution = mongoose.model('Contribution', contributionSchema);

export default Contribution;