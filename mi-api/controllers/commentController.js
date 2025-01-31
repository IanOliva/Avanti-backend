import {
    createComment,
    getCommentsByProject,
    deleteCommentByID,
    updateCommentByID
} from "../services/commentServices.js";

/**
 * Controller to create a new comment.
 * 
 * @param {Object} req - Object of the request HTTP.
 * @param {Object} req.body - The body of the request with comment data.
 * @param {string} req.body.text - Text of comment is required.
 * @param {string} req.body.author - Author ID is required.
 * @param {string} req.body.project - Project ID to which the comment belongs is requerid.
 * 
 * @param {Object} res - Object of response HTTP.
 * 
 * @returns {Object} Response HTTP with the comment created or error message. 
 * 
 */
export const createCommentController = async (req, res) => {
    try {
        const {
            text,
             project
            } = req.body;
        
        const author = req.user?.id;
        if (!author) {
            return res.status(401).json({
              message: "No estás autenticado",
              success: false,
            });
          }

        const newComment = await createComment({ 
            text,
            author,
            project
        });

        return res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
};

/**
 * Controller to obtain comments filtered by project ID and, optionally, by author's name.
 * 
 * @param {Object} req - Object of the HTTP request.
 * @param {Object} req.params - Contains the parameters sent in the URL path.
 * @param {string} req.params.projectId - Project ID with which comments are filtered, is required.
 * @param {Object} req.query - Contains the optional query parameters sent in the URL.
 * @param {string} [req.query.authorName] - Author's name with which comments are filtered, is optional.
 * 
 * @param {Object} res - Object of the HTTP response.
 * 
 * @returns {Object} JSON with the comments fetched or an error message.
 * 
 */
export const getCommentsByProjectController = async (req, res) => {
    try {
        const { projectId } = req.params; 
        const { authorName } = req.query;

        const comments = await getCommentsByProject(projectId, authorName);
        
        return res.status(200).json(comments);       
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

/**
 * Controller to delete a comment by its ID.
 * 
 * @param {Object} req - Object of the request HTTP.
 * @param {Object} req.params - Contains parameters sent in the URL
 * @param {string} req.params.commentId - ID of comment to be deleted, is required.
 * 
 * @param {Object} res - Object of response HTTP.
 * 
 * @returns {Object} - JSON with a success message and the ID of de comment deleted or a error message
 *
*/
export const deleteCommentByIdController = async (req, res) =>{
    try {
        const {commentId} = req.params;
        const author = req.user?.id;

        if (!author) {
            return res.status(401).json({
              message: "No estás autenticado",
              success: false,
            });
          }
        
        const result = await deleteCommentByID(commentId, author);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

export const updateCommentByIdController = async (req, res) => {
    try {
        const {commentId} = req.params;
        const {text} = req.body;
        const author = req.user?.id;
        
        if (!author) {
            return res.status(401).json({
              message: "No estás autenticado",
              success: false,
            });
          }

        const result = updateCommentByID(commentId, text, author);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}