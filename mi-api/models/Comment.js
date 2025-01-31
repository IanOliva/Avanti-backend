import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
    commentDate: {type: Date, default: Date.now},
});


const Comment = mongoose.model("Comment", commentSchema);

export default Comment;