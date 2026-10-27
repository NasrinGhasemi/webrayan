'use client';
import { memo } from 'react';

/**
 * کامپوننت کارت پروژه - Clean Code و بهینه شده
 */
const ProjectCard = memo(function ProjectCard({
  project,
  onViewDetails,
  className = '',
}) {
  const { title, description, image, tech, demoUrl, client, duration, year } =
    project;

  const handleViewDetails = () => {
    onViewDetails?.(project);
  };

  const handleDemoClick = e => {
    e.stopPropagation();
    if (demoUrl && demoUrl !== '#') {
      window.open(demoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      className={`
        bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
        transition-all duration-300 hover:-translate-y-2 group border border-gray-100
        ${className}
      `}
      role="article"
      aria-labelledby={`project-${project.id}-title`}
    >
      {/* Project Image/Icon */}
      <div className="relative h-48 bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 flex items-center justify-center overflow-hidden">
        <div
          className="text-8xl opacity-60 group-hover:scale-110 transition-transform duration-300"
          aria-hidden="true"
        >
          {image}
        </div>

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-3">
            <button
              onClick={handleViewDetails}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
              title="مشاهده جزئیات"
              aria-label={`مشاهده جزئیات پروژه ${title}`}
            >
              <EyeIcon />
            </button>

            {demoUrl && demoUrl !== '#' && (
              <button
                onClick={handleDemoClick}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
                title="مشاهده دمو"
                aria-label={`مشاهده دمو پروژه ${title}`}
              >
                <LinkIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3
            id={`project-${project.id}-title`}
            className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-200"
          >
            {title}
          </h3>
          <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
            {year}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Project Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium ml-2">مشتری:</span>
            <span>{client}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium ml-2">مدت زمان:</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {tech.map((technology, index) => (
            <span
              key={index}
              className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full font-medium border border-teal-200"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
});

// Icon components
const EyeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const LinkIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

export default ProjectCard;
