const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
    },
    lastName: {
      type: String,
      required: [true, "El apellido es requerido"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor usar un correo válido"],
      required: [true, "El correo es requerido"],
    },
    company: {
      type: String,
      required: [true, "El nombree  de la Empresa es requerido"],
    },
    position: {
      type: String, 
      enum: [
        "Analista de Reclutamiento",
        "Gerente de RH",
        "Reclutador Jr",
        "Recultador Sr",
        "Otros",
      ],
      required: [true, "La posición es requerida"],
    },
    sector: {
      type: String,
      enum: [
        "Educación",
        "Agricultura y Ganadería",
        "Legal",
        "Alimentos",
        "Comercio",
        "Construcción",
        "Energía y Agua",
        "Seguros",
        "Hosteleria y Turismo",
        "Tecnología",
        "Telecomunicaciones",
        "Transporte",
        "Automotriz",
        "Otros",
      ],
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
    },
    activo: {
      type: Boolean,
      default: false,
    },
    freeTrial: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
