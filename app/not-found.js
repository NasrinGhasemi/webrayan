import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-auto text-center px-6">
        {/* آیکون 404 */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-indigo-600 mb-4">404</div>
          <div className="text-4xl mb-4">🔍</div>
        </div>

        {/* متن اصلی */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          صفحه مورد نظر پیدا نشد!
        </h1>
        
        <p className="text-gray-600 mb-8">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است آدرس آن تغییر کرده باشد.
        </p>

        {/* دکمه‌های عمل */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            بازگشت به خانه
          </Link>
          
          <Link 
            href="/portfolio"
            className="block w-full border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            مشاهده نمونه‌کارها
          </Link>
        </div>

        {/* لینک‌های سریع */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">شاید به دنبال یکی از این‌ها باشید:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-indigo-600 hover:underline">درباره ما</Link>
            <Link href="/services" className="text-indigo-600 hover:underline">خدمات</Link>
            <Link href="/contact" className="text-indigo-600 hover:underline">تماس با ما</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
