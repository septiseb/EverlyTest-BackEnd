const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const questionSchema = new Schema({
  nameExam:String,
  question:String,
  typeQuestion:String,
  options:[String],
  image:String,
  answer:String,
});

module.exports = model("Question",questionSchema);

