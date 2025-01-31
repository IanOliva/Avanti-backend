import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios", success: false });
    }

    
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "El email ya está registrado", success: false });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "Usuario creado con éxito", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor", success: false });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios", success: false });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({
          message: "No existe un usuario registrado con ese email",
          success: false,
        });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Contraseña incorrecta", success: false });
    }

    
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    };

    
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Sesión iniciada con éxito",
        success: true,
        user: userResponse,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor", success: false });
  }
};


export const logout = async (_, res) => {
  try {
    
    res.cookie("token", "", { 
      httpOnly: true, 
      sameSite: "strict", 
      maxAge: 0 
    });
    
   
    return res.json({
      message: "Sesión cerrada con éxito",
      success: true,
    });
  } catch (error) {
    console.error(error);
    
    return res.status(500).json({ 
      message: "Error al cerrar la sesión", 
      success: false 
    });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: "ID de usuario inválido", 
        success: false 
      });
    }

    const user = await User.findById(userId).select("-password");

    
    if (!user) {
      return res.status(404).json({ 
        message: "Usuario no encontrado", 
        success: false 
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Error al obtener el perfil", 
      success: false 
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: "ID de usuario inválido", 
        success: false 
      });
    }

    const profilePicture = req.file;
    let cloudResponse;

    
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "No existe un usuario con ese ID", success: false });
    }

    
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res
      .status(200)
      .json({ user, message: "Perfil actualizado", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Error al actualizar el perfil", 
      success: false 
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validar formato del ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: "ID de usuario inválido", 
        success: false 
      });
    }

    // Buscar y eliminar usuario
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        message: "No existe un usuario con ese ID",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Usuario eliminado con éxito",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Error al eliminar el usuario", 
      success: false 
    });
  }
};
