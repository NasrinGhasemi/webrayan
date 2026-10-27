// اسکیماهای اعتبارسنجی با Zod

import { z } from "zod";

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(100, "نام نباید بیشتر از ۱۰۰ کاراکتر باشد")
    .trim(),
  email: z
    .string()
    .email("فرمت ایمیل صحیح نیست")
    .max(254, "ایمیل خیلی طولانی است")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .trim()
    .regex(/^(\+98|0)?9\d{9}$/, "شماره موبایل صحیح نیست (مثال: 09123456789)")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().max(200, "موضوع نباید بیشتر از ۲۰۰ کاراکتر باشد").optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "پیام باید حداقل ۱۰ کاراکتر باشد")
    .max(3000, "پیام نباید بیشتر از ۳۰۰۰ کاراکتر باشد"),
  projectType: z
    .enum([
      "website",
      "ecommerce",
      "personal",
      "corporate",
      "educational",
      "news",
      "restaurant & cafe",
      "other",
    ])
    .optional()
    .default("website"),
  budget: z.string().max(50).optional().default(""),
  priority: z
    .enum(["low", "medium", "high", "urgent"])
    .optional()
    .default("medium"),
  timeline: z.string().max(100).optional().default(""),
});

// User Registration Schema
export const registerSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(50).trim(),
  email: z
    .string()
    .email("فرمت ایمیل صحیح نیست")
    .max(254)
    .toLowerCase()
    .trim()
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^(\+98|0)?9\d{9}$/, "شماره موبایل معتبر نیست")
    .min(1, "شماره موبایل الزامی است"),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .max(128)
    .regex(/[a-z]/, "باید حداقل یک حرف کوچک داشته باشد")
    .regex(/[A-Z]/, "باید حداقل یک حرف بزرگ داشته باشد")
    .regex(/\d/, "باید حداقل یک عدد داشته باشد"),
});

// User Login Schema
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "ایمیل یا شماره موبایل الزامی است")
    .refine(
      (v) => /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(v) || /^(\+98|0)?9\d{9}$/.test(v),
      "فرمت ایمیل یا شماره موبایل صحیح نیست",
    )
    .transform((v) => (v.includes("@") ? v.toLowerCase().trim() : v.trim())),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

// فقط http(s)؛ رشته خالی => null
const httpUrl = z
  .union([
    z
      .string()
      .trim()
      .url("آدرس URL معتبر نیست")
      .refine((u) => /^https?:\/\//i.test(u), "فقط http/https مجاز است"),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform((v) => v || null);

// Portfolio Project Schema
export const portfolioProjectSchema = z.object({
  title: z
    .string()
    .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
    .max(100, "عنوان نباید بیشتر از ۱۰۰ کاراکتر باشد")
    .trim(),
  description: z
    .string()
    .trim()
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .max(2000, "توضیحات نباید بیشتر از ۲۰۰۰ کاراکتر باشد"),
  category: z.string().trim().min(1, "دسته‌بندی الزامی است").max(50),
  image: z.string().optional().default("🚀"),
  demoUrl: httpUrl,
  githubUrl: httpUrl,
  tech: z.array(z.string()).optional().default([]),
  client: z.string().max(100).optional().nullable(),
  duration: z.string().max(50).optional().nullable(),
  year: z
    .string()
    .regex(/^\d{4}$/, "سال باید ۴ رقم باشد")
    .optional()
    .nullable(),
  published: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  order: z.coerce.number().int().min(0).optional().default(0),
});

export const portfolioUpdateSchema = portfolioProjectSchema.partial().extend({
  id: z.string().min(1, "شناسه پروژه الزامی است"),
});

// Update Profile Schema
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد")
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^(\+98|0)?9\d{9}$/, "شماره موبایل صحیح نیست")
    .optional()
    .nullable(),
  image: z.string().url("آدرس تصویر معتبر نیست").optional().nullable(),
});

// Password Reset Schema
export const passwordResetSchema = z.object({
  email: z.string().email("فرمت ایمیل صحیح نیست").toLowerCase().trim(),
});

// Password Change Schema
export const passwordChangeSchema = z.object({
  token: z.string().min(1, "توکن الزامی است"),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .max(128, "رمز عبور خیلی طولانی است")
    .regex(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک داشته باشد")
    .regex(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
    .regex(/\d/, "رمز عبور باید حداقل یک عدد داشته باشد"),
});

// FAQ Question Schema
export const faqQuestionSchema = z.object({
  name: z.string().trim().min(2, "نام الزامی است").max(100),
  email: z.string().trim().toLowerCase().email("فرمت ایمیل صحیح نیست").max(254),
  question: z.string().trim().min(5, "سوال خیلی کوتاه است").max(1000, "سوال خیلی طولانی است"),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  skip: z.number().int().min(0).optional().default(0),
});

const formatIssues = (error) =>
  error.issues.map((err) => ({ field: err.path.join("."), message: err.message }));

//  Helper: Validate Request Body
export async function validateRequestBody(request, schema) {
  try {
    const body = await request.json();
    return { success: true, data: schema.parse(body) };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, errors: formatIssues(error) };
    return { success: false, errors: [{ message: "خطای اعتبارسنجی" }] };
  }
}

// Helper: Validate Query Params
export function validateQueryParams(searchParams, schema) {
  try {
    const params = Object.fromEntries(searchParams.entries());
    return { success: true, data: schema.parse(params) };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, errors: formatIssues(error) };
    return { success: false, errors: [{ message: "خطای اعتبارسنجی پارامترها" }] };
  }
}
