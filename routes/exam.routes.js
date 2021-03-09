const express = require("express");
const router = express.Router();
const Exam = require("../models/exam.model");
const Question = require("../models/question.model");
const GroupTest = require("../models/grouptest.model");
const Tester = require("../models/tester.model");
const User = require("../models/users.model");
3;
const nodemailer = require("nodemailer");
const multer = require("../configs/cloudinary.config");

//Test for the General View
router.get("/tests", async (req, res, next) => {
  try {
    const allTest = await Exam.find();
    res.status(200).json(allTest);
  } catch (e) {
    res.status(500).json({ errorMessage: e });
  }
});

//Test for the Users to add their tests
/* rotuer.put("/user-profile/profile",multer.single("profileImg"),(req,res,next)=>{
  //const image = req.file // buscar propiedad para el URL

}); */

router.put("/user-profile/profile", async (req, res, next) => {
  const {
    name,
    email,
    lastName,
    company,
    sector,
    position,
    img,
    id,
  } = req.body;

  try {
    const userUpdate = await User.findByIdAndUpdate(id, {
      name,
      email,
      lastName,
      company,
      sector,
      position,
      img,
    });
    res.status(201).json({ message: "Cambio Exitoso" });
  } catch (e) {
    res.status(500).json({ errorMessage: e });
  }
});

router.post("/user-profile/create-test", async (req, res, next) => {
  const {
    name,
    namePosition,
    department,
    positionDescription,
    user,
  } = req.body;

  try {
    const createGroupTest = await GroupTest.create({
      name,
      namePosition,
      department,
      positionDescription,
      user,
    });
    res.status(200).json(createGroupTest._id);
  } catch (e) {
    next(e);
  }
});

router.post("/logout", (req, res, next) => {
  req.session.destroy();
  res.status(200).json({ message: "Cerraste Sesión" });
});
//////////////////////////////////////////////////////////////////////////////
//////////////////////// Parametros///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

router.get("/tests/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const oneExam = await Exam.findById(id).populate("questions");
    res.status(200).json(oneExam);
  } catch (e) {
    res.status(500).json({ errorMessage: e });
  }
});

router.post("/tests/:id", async (req, res, next) => {
  const results = req.body;
  const { id } = req.params;

  try {
    const oneExam = await Exam.findById(id).populate("questions");
    let maxScore = oneExam.questions.length;
    let score = 0;

    for (let result in results) {
      const findQuestion = await Question.findById(result);
      if (findQuestion.answer === results[result]) {
        score++;
      }
    }
    const finalGrade =
      score / maxScore
        ? Number((score / maxScore).toFixed(2)) * 100 + "%"
        : "0% ";

    res.status(200).json({ message: "Examen Terminado" });
  } catch (e) {
    res.status(500).json({ errorMessage: e });
  }
});

router.get("/user-profile/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const findGroupTest = await GroupTest.find({ user: id })
      .populate("test")
      .populate("testerEmail");
    res.json(findGroupTest);
  } catch (e) {
    res.json({ errorMessage: "Estas equivocado" });
  }
});

router.get("/user-profile/edit-test/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const findGroupTest = await GroupTest.findById(id).populate("test");
    res.json(findGroupTest);
  } catch (e) {
    res.json({ errorMessage: "Estas equivocado" });
  }
});

router.post("/user-profile/create-test/:id", async (req, res, next) => {
  const { id } = req.params;
  //const checkTester = await Tester.find({ code: id });
  //const emailTesterDB = checkTester.map((t) => t.email);

  try {
    await GroupTest.findByIdAndUpdate(
      id,
      {
        $addToSet: { test: req.body },
      },
      { new: true }
    );
    res.json({ message: "Exito" });
  } catch (e) {
    res.json({ errorMessage: e });
  }

  /*   if (!testerEmail) {
    return res.redirect(`/user-profile/create-test/${id}`);
  } else if (!emailTesterDB.some((email) => email == testerEmail)) {
    const TesterCreate = await Tester.create({
      email: testerEmail,
      code: id,
    });
    const idTester = TesterCreate._id;
    const updateTester = await GroupTest.findByIdAndUpdate(
      id,
      { $addToSet: { testerEmail: idTester } },
      { new: true }
    );

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
    });

    transporter
      .sendMail({
        from: "sebsepdus@gmail.com",
        to: testerEmail,
        subject: "EverlyTest, solicita que contestes esta encuesta",
        text: `Este es el código para entrar ${id}`,
        html: `<b>Este es el código para entrar ${id}</b>`,
      })
      .then((info) => console.log(info))
      .catch((error) => console.log(error));
  } */
});

router.put("/user-profile/edit-test/:id", async (req, res, next) => {
  const { id } = req.params;
  const { idTestAdd } = req.body;
  //const checkTester = await Tester.find({ code: id });
  //const emailTesterDB = checkTester.map((t) => t.email);

  console.log(req.body);

  try {
    await GroupTest.findByIdAndUpdate(
      id,
      {
        test: req.body.test,   
      },
      { new: true }
    );
  } catch (e) {
    res.json({ errorMessage: e });
  }
});

router.delete("/delete-group-test/:idGroupTest", async (req, res, next) => {
  const { idGroupTest } = req.params;
  try {
    await GroupTest.findByIdAndDelete(idGroupTest);
    res.status(200).json({ message: "El test fue borrado" });
  } catch (e) {
    res.status(500).json({ errorMessage: e });
  }
});

router.get("/user-profile/details/:idGroupTest", async (req, res, next) => {
  const { idGroupTest } = req.params;

  try {
    const testerGroupTest = await Tester.find({ code: idGroupTest });
    res.json({
      tester: testerGroupTest.sort((a, b) => b.grade - a.grade),
    });
  } catch (e) {
    res.status(500).json({ errorMessage: e });
  }
});

module.exports = router;
