import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No autorizado: Se requiere un token válido",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { id: decoded.userId }; // Guardar el ID del usuario en req.user
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Token inválido o expirado",
      success: false,
    });
  }
};

