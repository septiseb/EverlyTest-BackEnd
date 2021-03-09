//Importaciones
const express = require("express");
const router = express.Router();
const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

// IMPORTACION DE MODELOS
const Exam = require("../models/exam.model");
const Question = require("../models/question.model");
const GroupTest = require("../models/grouptest.model");
const Tester = require("../models/tester.model");

//Variables
const roundSalt = 10;


//Rutas
router.get("/signup", (req, res, next) => {
  console.log(req.headers.cookie);
  res.send("hola");
});

router.post("/signup", async (req, res, next) => {
  const {
    name,
    email,
    password,
    lastName,
    company,
    sector,
    position,
  } = req.body;

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (!name || !email || !password || !lastName || !company) {
    res.status(400).json({
      errorMessage:
        "Todos los campos son mandatorios.",
    });

    return;
  }

  if (!regex.test(password)) {
    res.status(500).json({
      errorMessage:
        "Contraseña debe tener mínimo 6 carácteres, y por lo menos un número, una minúscula y una mayúscula.",
    });
    return;
  }

  try {
    const saltPass = await bcrypt.genSalt(roundSalt);
    const passwordHash = await bcrypt.hash(password, saltPass);

    const user = await User.create({
      name,
      email,
      password: passwordHash,
      lastName,
      company,
      sector,
      position,
    });
    req.session.currentUser = user;

    res.status(200).json(req.session.currentUser);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      res.status(500).json({ errorMessage: error.message });
    } else if (e.code === 11000) {
      res.status(500).json({
        errorMessage:
          "Usuario y correo deben ser unicos. El usuario o contraseña ya estan registrados",
        position: positionArray,
        sector: sectorArray,
      });
    }
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    res.status(400).json({
      errorMessage:
        "El Correo no fue encontrado. Por favor, ir al apartado de registro.",
    });
  } else if (bcrypt.compareSync(password, foundUser.password)) {
    
    req.session.currentUser = foundUser;

    res.status(200).json(req.session.currentUser._id);
  } else {
    res.status(500).json({ errorMessage: "Contraseña Incorrecta" });
  }
});

module.exports = router;
