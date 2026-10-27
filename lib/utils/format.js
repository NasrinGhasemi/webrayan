export function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(new Date(date))
}

export function formatRelativeTime(date) {
  const now = new Date()
  const past = new Date(date)
  const diff = Math.floor((now - past) / 1000)
  
  const minutes = Math.floor(diff / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (diff < 60) return 'همین الان'
  if (minutes < 60) return `${minutes} دقیقه پیش`
  if (hours < 24) return `${hours} ساعت پیش`
  return `${days} روز پیش`
}
