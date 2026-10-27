// API Response Utilities / استانداردسازی پاسخ‌های API
import { NextResponse } from "next/server";

const isDevelopment = process.env.NODE_ENV === "development";

function getTimestamp() {
  return new Date().toISOString();
}

function withRequestId(payload, requestId) {
  if (!requestId) {
    return payload;
  }

  return {
    ...payload,
    requestId,
  };
}

// Success Response Builder
export function successResponse(
  data,
  message = "عملیات با موفقیت انجام شد",
  status = 200,
  options = {},
) {
  const { requestId } = options;

  return NextResponse.json(
    withRequestId(
      {
        success: true,
        message,
        data,
        timestamp: getTimestamp(),
      },
      requestId,
    ),
    { status },
  );
}

// Error Response Builder
export function errorResponse(
  message = "خطایی رخ داده است",
  errors = null,
  status = 400,
  options = {},
) {
  const { requestId } = options;

  return NextResponse.json(
    withRequestId(
      {
        success: false,
        message,
        errors,
        timestamp: getTimestamp(),
      },
      requestId,
    ),
    { status },
  );
}

// Validation Error Response
export function validationErrorResponse(errors, options = {}) {
  const { requestId } = options;

  return NextResponse.json(
    withRequestId(
      {
        success: false,
        message: "خطای اعتبارسنجی",
        errors,
        timestamp: getTimestamp(),
      },
      requestId,
    ),
    { status: 422 },
  );
}

// Unauthorized Response
export function unauthorizedResponse(message = "دسترسی غیرمجاز", options = {}) {
  const { requestId } = options;

  return NextResponse.json(
    withRequestId(
      {
        success: false,
        message,
        timestamp: getTimestamp(),
      },
      requestId,
    ),
    { status: 401 },
  );
}

// Forbidden Response
export function forbiddenResponse(
  message = "شما اجازه دسترسی به این بخش را ندارید",
  options = {},
) {
  const { requestId } = options;

  return NextResponse.json(
    withRequestId(
      {
        success: false,
        message,
        timestamp: getTimestamp(),
      },
      requestId,
    ),
    { status: 403 },
  );
}

// Not Found Response
export function notFoundResponse(message = "موردی یافت نشد", options = {}) {
  const { requestId } = options;

  return NextResponse.json(
    withRequestId(
      {
        success: false,
        message,
        timestamp: getTimestamp(),
      },
      requestId,
    ),
    { status: 404 },
  );
}


// Server Error Response / نکته امنیتی:
//  جزئیات خطا فقط در development به client ارسال می‌شود.
//  در production فقط پیام عمومی و requestId برگردانده می‌شود.
export function serverErrorResponse(
  message = "خطای سرور",
  error = null,
  options = {},
) {
  const { requestId } = options;

  const response = {
    success: false,
    message: isDevelopment ? message : "خطایی در پردازش درخواست رخ داد.",
    timestamp: getTimestamp(),
  };

  if (isDevelopment && error) {
    response.error = {
      message: error instanceof Error ? error.message : String(error),
      ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
    };
  }

  return NextResponse.json(withRequestId(response, requestId), {
    status: 500,
  });
}

// Paginated Response
export function paginatedResponse(
  data,
  pagination = {},
  message = "عملیات با موفقیت انجام شد",
  options = {},
) {
  const { requestId } = options;

  const page = Math.max(Number(pagination.page) || 1, 1);
  const limit = Math.max(Number(pagination.limit) || 10, 1);
  const total = Math.max(Number(pagination.total) || 0, 0);

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return NextResponse.json(
    withRequestId(
      {
        success: true,
        message,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
        timestamp: getTimestamp(),
      },
      requestId,
    ),
    { status: 200 },
  );
}

// Response with Headers
export function responseWithHeaders(response, headers = {}) {
  Object.entries(headers).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      response.headers.set(key, String(value));
    }
  });

  return response;
}

// Created Response
export function createdResponse(
  data,
  message = "با موفقیت ایجاد شد",
  options = {},
) {
  return successResponse(data, message, 201, options);
}

// No Content Response
export function noContentResponse() {
  return new NextResponse(null, { status: 204 });
}

// Accepted Response
export function acceptedResponse(message = "درخواست پذیرفته شد", options = {}) {
  const { requestId } = options;

  return NextResponse.json(
    withRequestId(
      {
        success: true,
        message,
        timestamp: getTimestamp(),
      },
      requestId,
    ),
    { status: 202 },
  );
}

// Rate Limit Response
export function rateLimitResponse(
  retryAfter,
  message = "تعداد درخواست‌ها بیش از حد مجاز است",
) {
  const normalizedRetryAfter = Math.max(
    Number.parseInt(retryAfter, 10) || 1,
    1,
  );

  return NextResponse.json(
    {
      success: false,
      message,
      retryAfter: normalizedRetryAfter,
      timestamp: getTimestamp(),
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(normalizedRetryAfter),
      },
    },
  );
}

// Method Not Allowed Response
export function methodNotAllowedResponse(allowedMethods = []) {
  const normalizedMethods = allowedMethods.map((method) =>
    String(method).toUpperCase(),
  );

  return NextResponse.json(
    {
      success: false,
      message: "متد HTTP مجاز نیست",
      allowedMethods: normalizedMethods,
      timestamp: getTimestamp(),
    },
    {
      status: 405,
      headers: {
        Allow: normalizedMethods.join(", "),
      },
    },
  );
}

// Conflict Response
export function conflictResponse(message = "تضاد در داده‌ها", options = {}) {
  const { requestId } = options;

  return NextResponse.json(
    withRequestId(
      {
        success: false,
        message,
        timestamp: getTimestamp(),
      },
      requestId,
    ),
    { status: 409 },
  );
}

const apiResponse = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  paginatedResponse,
  responseWithHeaders,
  createdResponse,
  noContentResponse,
  acceptedResponse,
  rateLimitResponse,
  methodNotAllowedResponse,
  conflictResponse,
};

export default apiResponse;

