export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-slate-200/80 bg-white shadow-xs ${className}`}>
      {children}
    </div>
  );
}
