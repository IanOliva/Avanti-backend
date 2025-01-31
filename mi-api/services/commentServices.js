import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

/**
 * Create a new comment associated with an author and a project.
 * 
 * @param {Object} data - data required to create the comment.
 * @param {string} data.text - Text of the comment is required.
 * @param {string} data.author - Author ID is required.
 * @param {string} data.project - Project ID to which the comment belongs is requerid. 
 * 
 * @returns {Promise<Object>} The comment created.
 */
export const createComment = async (data) => {
    try {
        const {
            text,
            author,
            project
        } = data;
        
        if (!author || !text || !project) {
            throw new Error('Faltan completar campos: autor, texto o proyecto');
        }
        
        const authorExists = await User.findById(author);
        if (!authorExists) {
            throw new Error('El autor de este comentario no existe');
        }

        const projectExists = await Project.findById(project);
        if (!projectExists) {
            throw new Error('El proyecto de este comentario no existe');
        }
        
        const newComment = new Comment({
            text,
            author,
            project
        });
        
        const savedComment = await newComment.save();
        
        return savedComment; 

    } catch (error) {
        console.error('Error al crear el comentario: ', error);
        throw new Error('No se puede crear el comentario. ', error.message);   
    }
}

/**
 * Gets projects comments with option to filter by author.
 * 
 * @param {string} projectId - projectId is required.
 * @param {string} authorName - authorName is optional.
 * 
 * @returns {Promise<Array>} The list of comments that match the filters provided.
 */
export const getCommentsByProject = async ( projectId, authorName) => {
    try {        
        const project = await Project.findById(projectId);
        if (!project) {
            throw new Error('No se encontró un proyecto con ese ID');
        }

        const filter = {project: project._id};

        if (authorName){
            const author = await User.findOne({name: authorName}).select('_id');
            if(!author){
                throw new Error('No se encontró un User con ese nombre');     
            }
            //Added property 'author' in filter
            filter.author = author._id;
        }

        const comments = await Comment.find(filter)
        .populate({path: 'author', select: 'name profilePicture'});

        return comments;        
    } catch (error) {
        console.error('Error al obtener los comentarios', error);
        throw new Error('No se pueden obtener los comentarios. ' + error.message);
    }
};

/**
 * Delete a comment from database using its ID.
 *
 * @param {string} commentId - ID of comment to be deleted.
 * 
 * @returns {Object} - An object that includes a success message and the ID of the deleted comment.
 * 
 */
export const deleteCommentByID = async (commentId, author) => {
    try {
        console.log('ser ', author);
        const comment = await Comment.findById(commentId);

        if(!comment){
            throw new Error('No se encontró el comentario con el ID proporcionado.');
        }

        const user = await User.findById(author);

        if (!user) {
            throw new Error('Usuario no encontrado.');
        }

        if (comment.author.toString() !== author && user.role !== 'admin') {
            throw new Error('No tienes permiso para eliminar este comentario.');
        }

        await Comment.findByIdAndDelete(commentId);

        return {
            message: 'Comentario eliminado exitosamente.',
            deleteCommentId: commentId 
        };
    } catch (error) {
        console.error('Error al eliminar el comentario: ', error);
        throw new Error('No se pudo eliminar el comentario: ' + error.message);
    }
}


export const updateCommentByID = async (data) => {
    try {
        const {
            commentId, 
            text,
            author
        } = data; 

        if (!commentId || !text){
            throw new Error('Falta completar algunos campos.');
        }

        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new Error('No se encontró ningún comentario con el ID proporcionado.');
        }

        if(comment.author.ToString() !== author){
            throw new Error('No tienes permiso para modificar este comentario.');
        }

        comment.text = text;
        await comment.save();

        return comment;
    } catch (error) {
        console.error('Error al actualziar los comentarios', error);
        throw new Error('No se pueden actualizar los comentarios. ' + error.message);
    }
}
