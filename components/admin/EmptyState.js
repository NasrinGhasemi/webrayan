export default function EmptyState({ title = 'موردی یافت نشد', description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
      <div className="text-base font-extrabold text-slate-900">{title}</div>
      {description ? <div className="mt-2 text-sm text-slate-500">{description}</div> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
