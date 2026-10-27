import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import logger from "@/lib/logger";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام الزامی است"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "ایمیل الزامی است"],
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    phone: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.provider || this.provider === "credentials";
      },
      minlength: 8,
      select: false,
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    lastFailedLogin: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
      default: null,
      select: false,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true },
);

// 🔐 hash password
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    logger.debug("Password hashed");
    next();
  } catch (err) {
    logger.error("Password hash error", err);
    next(err);
  }
});

// 🔍 compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// جلوگیری از مدل تکراری
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
