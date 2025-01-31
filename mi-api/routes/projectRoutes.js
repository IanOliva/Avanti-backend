import express from "express";
const router = express.Router();
import * as projectController from "../controllers/projectController.js";
import { authenticateUser } from "../middlewares/auth.js";


router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.post("/create",authenticateUser, projectController.createProject);
router.get("/delete/:id", projectController.deleteProject);
router.post("/update/:id", projectController.updateProject);

export default router;