import express from "express";
import multer from "multer";
const router = express.Router();
import cloudinary from "../utils/cloudinary.js";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import * as projectController from "../controllers/projectController.js";
import { authenticateUser } from "../middlewares/auth.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',  // Carpeta en Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    },
});

const upload = multer({ storage });


router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.post("/create",authenticateUser,upload.single('projectImg'), projectController.createProject);
router.get("/delete/:id", projectController.deleteProject);
router.post("/update/:id", projectController.updateProject);

export default router;