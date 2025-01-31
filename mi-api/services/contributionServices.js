import  Contribution  from "../models/Contribution.js";
import User from '../models/User.js';
import Project from '../models/Project.js';

/**
 * Creates a new contribution associated with donator and cproject.
 * 
 * @param {Object} data - Data of the contribution.
 * @param {string} data.donator - Donator ID is required.
 * @param {string} data.project - Project ID is required.
 * @param {string} data.paymentMethod - Type of payment method.
 * @param {int} data.paymentAmount - Amount donated. 
 * @returns {Promise<Object>} - The created contribution.
 */
export const createContribution = async (data) => {
    try {
        const {
            donator,
            project,
            paymentMethod,
            paymentAmount
        } = data;

        if (!donator || !project || !paymentMethod || !paymentAmount){
            throw new Error('Falta completar alguno de estos campos: donator, project, paymentMethod, paymentAmount');
        }

        const existingDonator = await User.findById(donator);
        if (!existingDonator){
            throw new Error('El donatante de esta contribución no existe.');
        }

        const existingProject = await Project.findById(project);
        if(!existingProject){
            throw new Error('El proyecto en el que quieres contribuir no existe.');
        }

        const newContribution = new Contribution({
            donator,
            project,
            paymentMethod,
            paymentAmount
        });

        const saveContribution = await newContribution.save();

        return saveContribution;
    } catch (error) {
        console.error('Error al crear la contribución. ', error);
        throw new Error('No se pudo crear la contribución. ', error.message);
    }
}

/**
 * Retrieves all contributions made to a specific project.
 * 
 * @param {string} donatorId - Project ID is requerid.
 * 
 * @returns {Promise<Array>} - The list of contributions.
 */
export const getContributionByProject = async (projectId) =>{
    try {

        const existingProject = await Project.findById(projectId);
        if (!existingProject){
            throw new Error('El proyecto no existe.');
        }

        const contributions = Contribution.find({project: projectId})
        .populate('donator', 'name profilePicture')
        .populate('project', 'title descripcion');

        return contributions;
    } catch (error) {
        console.error('Error al obtener las contribuciones', error);
        throw new Error('No se puedieron obtener las contribuciones. ' + error.message);
    }
}