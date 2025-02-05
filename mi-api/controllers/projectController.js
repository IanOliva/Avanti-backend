import  Project  from "../models/Project.js";
import mongoose from "mongoose";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    return res.status(200).json({
      success: true,
      message: "Proyectos obtenidos con éxito",
      projects: projects || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener los proyectos",
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de proyecto requerido",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Proyecto obtenido con éxito",
      project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener el proyecto",
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    console.log(req.body);
    const userId = req.user?.id;
    const projectImg = req.file;

    // Validar que todos los campos sean requeridos
    if (!title || !description || !category || !projectImg) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
        success: false,
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "No estás autenticado",
        success: false,
      });
    }

    // Subir imagen a Cloudinary
    let cloudResponse;
    if (projectImg) {
      cloudResponse = await cloudinary.uploader.upload(projectImg.path, {
        folder: "projects",
      });

      // Verificar si Cloudinary respondió correctamente
      if (!cloudResponse.secure_url) {
        return res.status(500).json({
          message: "Error al subir la imagen",
          success: false,
        });
      }
    }

    // Crear el proyecto con la URL de Cloudinary
    const newProject = await Project.create({
      title,
      description,
      category,
      projectImg: cloudResponse.secure_url || null, // Guardar la URL en la base de datos
      owner: userId,
    });

    return res.status(201).json({
      message: "Proyecto creado con éxito",
      success: true,
      project: newProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error del servidor",
      success: false,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "ID de proyecto inválido",
        success: false,
      });
    }

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({
        message: "No existe un proyecto con ese ID",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Proyecto eliminado con éxito",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error del servidor",
      success: false,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;
    const projectImg = req.file;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
        success: false,
      });
    }

    let cloudResponse;
    if (projectImg) {
      const fileUri = getDataUri(projectImg);
      cloudResponse = await cloudinary.uploader.upload(fileUri);

      // Verificar si Cloudinary respondió correctamente
      if (!cloudResponse) {
        return res
          .status(500)
          .json({ message: "Error al subir la imagen", success: false });
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        projectImg: cloudResponse?.secure_url || null, // Si no hay imagen, puede ser null
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        message: "No existe un proyecto con ese ID",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Proyecto actualizado con éxito",
      success: true,
      project: updatedProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error del servidor",
      success: false,
    });
  }
};
