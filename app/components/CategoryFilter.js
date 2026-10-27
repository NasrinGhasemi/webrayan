'use client';
import { memo } from 'react';

/**
 * کامپوننت فیلتر دسته‌بندی - Clean Code
 */
const CategoryFilter = memo(function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className = '',
}) {
  const handleCategoryClick = categoryId => {
    if (categoryId !== selectedCategory) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className={`flex flex-wrap justify-center gap-3 mb-12 ${className}`}>
      {categories.map(category => {
        const isActive = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm 
              transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500'
                  : 'bg-white/80 backdrop-blur-sm text-blue-800 border border-white/20 shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-cyan-400'
              }
            `}
            aria-pressed={isActive}
            aria-label={`فیلتر بر اساس ${category.name}`}
          >
            <span className="text-lg" aria-hidden="true">
              {category.icon}
            </span>
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
});

export default CategoryFilter;
