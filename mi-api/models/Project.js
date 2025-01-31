import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, unique: true, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    projectImg: {type: String, required: true},
    projectStatus: {type: String, required: true, enum:['available','closed','pendingRevision'], default: 'available'},
}, {timestamps: true});

const Project = mongoose.model('Project', projectSchema);
export default Project;