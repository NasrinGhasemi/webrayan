'use client';
import { memo } from 'react';

/**
 * کامپوننت نمایش تکنولوژی‌های استفاده شده
 */
const TECH_CATEGORIES = [
  {
    id: 'frontend',
    title: 'فرانت‌اند',
    icon: '🎨',
    technologies: [
      { name: 'Next.js', level: 95, color: 'from-gray-800 to-gray-600' },
      { name: 'React', level: 90, color: 'from-blue-500 to-blue-400' },
      { name: 'Tailwind CSS', level: 85, color: 'from-teal-500 to-cyan-400' },
      { name: 'TypeScript', level: 80, color: 'from-blue-600 to-blue-500' },
      { name: 'Vue.js', level: 75, color: 'from-green-500 to-green-400' },
    ],
  },
  {
    id: 'backend',
    title: 'بک‌اند',
    icon: '⚙️',
    technologies: [
      { name: 'Node.js', level: 90, color: 'from-green-600 to-green-500' },
      { name: 'Express.js', level: 85, color: 'from-gray-700 to-gray-600' },
      { name: 'PostgreSQL', level: 80, color: 'from-green-500 to-green-400' },
      { name: 'PostgreSQL', level: 75, color: 'from-blue-600 to-blue-500' },
      { name: 'Python', level: 70, color: 'from-yellow-500 to-yellow-400' },
    ],
  },
  {
    id: 'tools',
    title: 'ابزارها',
    icon: '🛠️',
    technologies: [
      { name: 'Git', level: 90, color: 'from-orange-500 to-orange-400' },
      { name: 'Docker', level: 75, color: 'from-blue-500 to-blue-400' },
      { name: 'AWS', level: 70, color: 'from-yellow-600 to-yellow-500' },
      { name: 'Vercel', level: 85, color: 'from-gray-800 to-gray-600' },
      { name: 'Figma', level: 80, color: 'from-purple-500 to-purple-400' },
    ],
  },
];

const TechStack = memo(function TechStack({ className = '' }) {
  return (
    <section
      className={`relative py-20 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 overflow-hidden ${className}`}
    >
      {/* Background Pattern - مشابه صفحات دیگر */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20 mb-8">
            <span className="text-4xl" role="img" aria-label="تکنولوژی‌ها">
              🚀
            </span>
            <span className="text-blue-600 font-semibold">تکنولوژی‌های ما</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              تکنولوژی‌های ما
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 drop-shadow-2xl shadow-amber-500/40 tracking-wider font-extrabold mt-2">
              وب‌رایان
            </span>
          </h2>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            با استفاده از جدیدترین و قدرتمندترین تکنولوژی‌های روز دنیا، بهترین
            راه‌حل‌ها را ارائه می‌دهیم
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Tech Categories */}
        <div className="grid md:grid-cols-3 gap-8">
          {TECH_CATEGORIES.map(category => (
            <div
              key={category.id}
              className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl" aria-hidden="true">
                    {category.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {category.title}
                </h3>
              </div>

              {/* Technologies List */}
              <div className="space-y-4">
                {category.technologies.map(tech => (
                  <div key={tech.name} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">
                        {tech.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {tech.level}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${tech.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${tech.level}%` }}
                        role="progressbar"
                        aria-valuenow={tech.level}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`مهارت ${tech.name}: ${tech.level} درصد`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '15+', label: 'تکنولوژی مسلط', icon: '⚡' },
            { number: '1+', label: 'سال تجربه', icon: '⏰' },
            { number: '5+', label: 'پروژه موفق', icon: '🚀' },
            { number: '5+', label: 'مشتری راضی', icon: '😊' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-700 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default TechStack;
