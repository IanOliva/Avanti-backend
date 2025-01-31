import {
    createContribution,
    getContributionByProject
} from '../services/contributionServices.js';

/**
 * Controller to create a new contribution made by a donor to a project.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request, containing the parameters for creating a contribution.
 * @param {string} req.body.donator - The ID of the user making the contribution is required.
 * @param {string} req.body.project - The ID of the project the contribution is being made to is required.
 * @param {string} req.body.paymentMethod - The payment method used for the contribution is required. Can be 'cash', 'card', or 'paypal'.
 * @param {number} req.body.paymentAmount - The amount of money being contributed is required.
 * 
 * @param {Object} res - The HTTP response object.
 * 
 * @returns {Object} JSON response containing the newly created contribution or an error message.

 */
export const createContributionController = async(req, res) => {
    try {
        const {
            donator,
            project,
            paymentMethod,
            paymentAmount
        } = req.body;

        const newContribution = await createContribution({
            donator,
            project,
            paymentMethod,
            paymentAmount
        });

        return res.status(201).json(newContribution);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

/**
 * Controller to retrieve contributions to a specific project.
 * 
 * @param {Object} req - HTTP request object.
 * @param {Object} req.params - Contains route parameters.
 * @param {string} req.params.projectId - Project ID is required.
 * 
 * @param {Object} res - HTTP response object.
 * 
 * @returns {Object} JSON response with the contributions related to the specified project or an error message.
 */
export const getContributionByProjectController = async (req, res) => {
    try {
        const {projectId} = req.params;

        const contributions = await getContributionByProject(projectId);

        return res.status(200).json(contributions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}
