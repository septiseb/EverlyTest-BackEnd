const express = require("express");
const router = express.Router();
const Exam = require("../models/exam.model");
const Question = require("../models/question.model");
const GroupTest = require("../models/grouptest.model");
const Tester = require("../models/tester.model");

router.post("/login-tester", async (req, res, next) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400).json({ errorMessage: "Todos los campos son obligatorios" });
  }

  try {
    const testerFind = await Tester.find({ email: email.toLowerCase() });
    const testFindEmail = testerFind ? testerFind : null;
    if (testFindEmail) {
      //IT COULD BE A PROBLEM LATER
      if (testFindEmail.filter((test) => test.code == code).length > 0) {
        const userForTest = testerFind.filter((test) => test.code == code)[0];
        res.status(200).json(userForTest.id);
      } else {
        res.status(400).json({
          errorMessage: "No coincide el código",
        });
      }
    } else {
      res.status(400).json({
        errorMessage: "El correo no fue encontrado",
      });
    }
  } catch (e) {
    res.status(500).json({ errorMesagge: "Hola" });
  }
});

router.get("/tester/:idTester", async (req, res, next) => {
  const { idTester } = req.params;

  try {
    const userAndTest = await Tester.findById(idTester)
      .populate({ path: "code", populate: { path: "test", model: "Exam" } })
      .populate({ path: "code", populate: { path: "user", model: "User" } });
    res.status(200).json(userAndTest);
  } catch (e) {
    res.status(500).json({ errorMessage: e });
  }
});

router.get("/tester/:idTester/:idTest", async (req, res, next) => {
  const { idTester, idTest } = req.params;

  try {
    const questions = [];

    const findTestQuestions = await GroupTest.findById(idTest).populate({
      path: "test",
      populate: { path: "questions", model: "Question" },
    });
    findTestQuestions.test.forEach((question) =>
      question.questions.forEach((qst) => questions.push(qst))
    );
    res.status(200).json({ questions, idTester, idTest });
  } catch (e) {
    res.status(500).json({ errorMessage: e });
  }
});

router.post("/tester/:idTester/:idTest", async (req, res, next) => {
  const { idTester, idTest } = req.params;
  const maxScore = Number(Object.assign(req.body.numberQuestions));
  const results = Object.assign(req.body);
  delete results.numberQuestions;

  try {
    let score = 0;

    for (let result in results) {
      const findQuestion = await Question.findById(result);
      if (findQuestion.answer === results[result]) {
        score++;
      }
    }

    const finalGrade =
      score / maxScore ? Number(((score / maxScore) * 100).toFixed(0)) : 0;
    console.log(finalGrade);

    await Tester.findByIdAndUpdate(
      idTester,
      { grade: finalGrade, answerTest: true },
      { new: true }
    );

    res.status(200).json({ message: "El examen fue contestado" });
  } catch (e) {
    res.status(500).json({ errorMessage: e });
  }
});

module.exports = router;
