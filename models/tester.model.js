const mongoose = require("mongoose");
const {model,Schema} = mongoose;

const testerSchema = new Schema({
  email:String,
  name:String,
  lastName:String,
  answerTest:{type:Boolean,default:false},
  grade:{type:Number,default:0},
  code:{type:Schema.Types.ObjectId, ref:"GroupTest"},
});

module.exports = model("Tester",testerSchema);