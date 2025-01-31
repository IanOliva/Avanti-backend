import express from 'express';
import {
    createContributionController,
    getContributionByProjectController
} from '../controllers/contributionController.js';

const contributionsRouter = express.Router();

/*
*
* Example: POST http://localhost:3000/contributions
* JSON example:
{
   "donator": "67910a95d1a948a9fab36ee4",
   "project": "6793016ef6ae53611e32d8eb" , 
   "paymentMethod": "cash",
   "paymentAmount": 50000
}
*
*/
contributionsRouter.post('/', createContributionController);

/*
*
* Example: GET http://localhost:3000/contributions/project/6793016ef6ae53611e32d8eb
* JSON response example:
[
	{
		"_id": "6797d75a8998f62d0388b7c6",
		"donator": {
			"_id": "67910a95d1a948a9fab36ee4",
			"name": "Test",
			"profilePicture": ""
		},
		"project": {
			"_id": "6793016ef6ae53611e32d8eb",
			"title": "Admawdawdin"
		},
		"paymentMethod": "cash",
		"paymentAmount": 50000,
		"contributionDate": "2025-01-27T18:58:34.065Z",
		"__v": 0
	}
]
*
*/
contributionsRouter.get('/project/:projectId', getContributionByProjectController);

export default contributionsRouter;