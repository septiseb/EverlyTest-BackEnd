const User = require("../models/users.model");

exports.dayTrials = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userFound = await User.findById(id);

    const leftDay = Math.ceil((Date.now() - userFound.createdAt) / (1000 * 60 * 60 * 24))
    
    if (leftDay  || userFound.activo) {
      req.leftDay = leftDay;
      next();
    } else {
      res.status(400).json({ errorMessage: "Tu tiempo de prueba ha expirado" });
    }
  } catch (e) {
    res.json(e);
  }
};
