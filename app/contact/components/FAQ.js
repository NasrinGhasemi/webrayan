// app/contact/components/FAQ.js
"use client";
import { useState, memo } from "react";

const FAQ = memo(({ faqs, onAskQuestionClick }) => {
  const [openItem, setOpenItem] = useState(null); // Only one item can be open at a time

  const toggleItem = (id) => {
    setOpenItem((prev) => (prev === id ? null : id)); // Close if same item, open if different
  };

  return (
    <div className="space-y-6">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
        >
          <button
            onClick={() => toggleItem(faq.id)}
            className={`w-full text-right p-6 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
              openItem === faq.id ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
            aria-expanded={openItem === faq.id}
            aria-controls={`faq-content-${faq.id}`}
          >
            <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-start gap-4 flex-1">
              <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  openItem === faq.id ? "bg-blue-500" : "bg-cyan-400"
                }`}
              >
                {faq.num ?? faq.id}
              </div>
              <span
                className={
                  openItem === faq.id ? "text-blue-700" : "text-blue-800"
                }
              >
                {faq.question}
              </span>
            </h3>
            <div
              className={`mr-4 transition-all duration-300 ease-in-out ${
                openItem === faq.id
                  ? "rotate-180 text-blue-600"
                  : "text-blue-400"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              openItem === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div id={`faq-content-${faq.id}`}>
              <div className="px-6 pb-6">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-blue-700 leading-relaxed text-sm md:text-base flex-1">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Additional Help */}
      <div className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-200">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-blue-800 mb-3">
          سوال دیگری دارید؟
        </h3>
        <p className="text-blue-600 mb-6 max-w-md mx-auto leading-relaxed">
          اگر سوال شما در لیست بالا نیست، با کمال میل پاسخگو هستم.
        </p>
        <button
          type="button"
          onClick={onAskQuestionClick}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-7 py-3 rounded-lg font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-lg hover:from-cyan-500 hover:to-blue-500 tracking-tight hover:tracking-wide cursor-pointer"
          aria-expanded="false"
          aria-controls="ask-question"
        >
          سوال جدید
        </button>
      </div>
    </div>
  );
});

FAQ.displayName = "FAQ";

export default FAQ;
