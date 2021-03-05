const mongoose = require("mongoose");
const Question = require("../models/question.model");
const questionData = require("../models/data/question.data");
const Exam = require("../models/exam.model");
const examData = require("../models/data/exam.data");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
 .then(() => {
    console.log(`Successfully connected to the database Everlytest`);
  })
  .catch((error) => {
    console.error(
      `An error ocurred trying to connect to the database Everlytest: `,
      error
    );
    process.exit(1);
  });

 Exam.create(examData).then(quesDB=>{
    console.log(quesDB.length);
    mongoose.connection.close();
  }).catch(e=>console.log(e));
