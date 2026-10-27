import mongoose from 'mongoose';

const faqQuestionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام الزامی است'],
      trim: true,
      minlength: [2, 'نام باید حداقل 2 کاراکتر باشد'],
      maxlength: [100, 'نام نباید بیشتر از 100 کاراکتر باشد'],
    },
    email: {
      type: String,
      required: [true, 'ایمیل الزامی است'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'فرمت ایمیل صحیح نیست'],
    },
    question: {
      type: String,
      required: [true, 'سوال الزامی است'],
      trim: true,
      minlength: [10, 'سوال باید حداقل 10 کاراکتر باشد'],
      maxlength: [500, 'سوال نباید بیشتر از 500 کاراکتر باشد'],
    },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'answered', 'rejected'],
      default: 'new',
      index: true,
    },
    ip: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

faqQuestionSchema.index({ createdAt: -1 });

const FaqQuestion =
  mongoose.models.FaqQuestion ||
  mongoose.model('FaqQuestion', faqQuestionSchema);

export default FaqQuestion;
