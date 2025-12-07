const mongoose = require("mongoose");
const schemaType = require("../../types");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: schemaType.TypeString,
      required: true,
      trim: true,
    },

    username: {
      type: schemaType.TypeString,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: schemaType.TypeString,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: schemaType.TypeString,
      required: true,
    },

    avatar_url: {
      type: schemaType.TypeString,
      default: "",
    },

    status: {
      type: schemaType.TypeString,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active",
    },

    role: {
      type: schemaType.TypeString,
      default: "member",
      enum: ["admin", "user"],
    },

    last_login: {
      type: schemaType.TypeDate,
    },

    created_date: {
      type: schemaType.TypeDate,
      default: Date.now,
    },

  },
  { timestamps: true }
);

module.exports = userSchema;
