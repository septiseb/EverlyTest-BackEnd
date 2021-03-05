const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const groupTestSchema = new Schema({
  name:{
    type:String,
    required:[true,"El campo del nombre es necesario"]
  },
  testerEmail:[{
    type: Schema.Types.ObjectId, ref:"Tester"
  }],
  user: {
    type: Schema.Types.ObjectId, ref:"User"
  },
  test:[{
    type: Schema.Types.ObjectId, ref:"Exam"
  }],
  namePosition:String,
  department:String,
  positionDescription:String,
});

module.exports = model("GroupTest",groupTestSchema);