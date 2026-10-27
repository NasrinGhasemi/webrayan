'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md w-full mx-auto text-center px-6">
            {/* آیکون خطا */}
            <div className="mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                خطایی رخ داده است!
              </h1>
            </div>

            {/* پیام خطا */}
            <p className="text-gray-600 mb-6">
              متأسفانه مشکلی در سایت پیش آمده است. لطفاً دوباره تلاش کنید.
            </p>

            {/* دکمه‌های عمل */}
            <div className="space-y-4">
              <button
                onClick={() => reset()}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                تلاش مجدد
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full border border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                بازگشت به خانه
              </button>
            </div>

            {/* اطلاعات تماس */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                اگر مشکل ادامه دارد، با ما تماس بگیرید:
              </p>
              <a 
                href="/contact" 
                className="text-red-600 hover:underline text-sm"
              >
                صفحه تماس
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
