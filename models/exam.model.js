const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const examSchema = new Schema({
  name:{
    type:String
  },
  position:{
    type:[String]
  },
  difficulty:{
    type:String,
    enum:["easy","medium","hard"]
  },
  skills:{
    type:String,
    enum:["soft","hard","culture fit","cognitive","pshycometric"]
  },
  url:{
    type:String,
    default:"../images/test-default.png"
  },
  description:{
    type:String,
  },
  duration:{
    type:Number,
    default:10,
  },
  questions:[{type:Schema.Types.ObjectId, ref:"Question"}]
});

module.exports = model("Exam",examSchema);