const mongoose = require("mongoose");
const validatorHelper = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 2,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (emailId) {
          return validatorHelper.isEmail(emailId);
        },
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (password) {
          return validatorHelper.isStrongPassword(password);
        },
      },
    },
    Age: {
      type: Number,
      min: 18,
      validate: {
        validator: function (Age) {
          return Age >= 18;
        },
        message: "Minimum age for registering is 18 years",
      },
    },
    gender: {
      type: String,
      validate: {
        validator: (value) => {
          return ["male", "female", "others"].includes(value); // Return the result
        },
        message: "gender is not valid", // Message as a sibling of validator
      },
      lowercase: true, // Outside validate object
    },

    skills: {
      type: [String],
      validate: {
        validator: function (skills) {
          return skills.length <= 20;
        },
        message: "You can only enter at most 20 skills",
      },
    },
    about: {
      type: String,
      default:
        "hi there this is the about section where you can add something about yourself",
    },
    photoUrl: {
      type: String,
      default: function () {
        const gender = this.gender?.toLowerCase?.();
        {
          if (gender) {
            console.log(gender);
            console.log(gender === "male");
            if (gender === "male") {
              return "https://avatar.iran.liara.run/public/boy#42";
            } else if (gender === "female") {
              return "https://avatar.iran.liara.run/public/girl#42";
            } else {
              return "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
            }
          }
        }
      },
    },
  },

  { timestamps: true }
);

userSchema.methods.generateJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Aniket@123");
  return token;
};
userSchema.methods.verifyPassword = async function (userInputedPassword) {
  const hashedPassword = this.password;
  const isValidPassword = await bcrypt.compare(
    userInputedPassword,
    hashedPassword
  );
  return isValidPassword;
};
module.exports = mongoose.model("User", userSchema);
