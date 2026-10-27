import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    repliedBy: {
      type: String,
      required: true,
      trim: true,
    },

    repliedAt: {
      type: Date,
      default: Date.now,
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    emailSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: true,
  },
);

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
      maxlength: 30,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },

    // اطلاعات تکمیلی فرم درخواست پروژه
    projectType: {
      type: String,
      trim: true,
      default: "website",
      maxlength: 100,
    },

    budget: {
      type: String,
      trim: true,
      default: null,
      maxlength: 100,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },

    timeline: {
      type: String,
      trim: true,
      default: null,
      maxlength: 100,
    },

    // اطلاعات فنی و منشأ ثبت پیام
    ip: {
      type: String,
      trim: true,
      default: "unknown",
      maxlength: 100,
    },

    userAgent: {
      type: String,
      trim: true,
      default: "unknown",
      maxlength: 1000,
    },

    source: {
      type: String,
      trim: true,
      default: "contact_form",
      maxlength: 100,
    },

    // وضعیت مدیریت پیام در پنل ادمین
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    replies: {
      type: [replySchema],
      default: [],
    },
  },
  {
    timestamps: true,

    // حیاتی: هم‌راستاسازی Mongoose با داده‌های Native MongoDB قبلی
    collection: "contact_messages",
  },
);

// ایندکس مناسب برای لیست پیام‌های پنل ادمین:
// جدیدترین پیام‌ها، با امکان فیلتر سریع وضعیت و خوانده‌شدن.
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ isRead: 1, createdAt: -1 });

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
