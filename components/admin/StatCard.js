export default function StatCard({ title, value, icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-600">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 ${colors[color]} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
