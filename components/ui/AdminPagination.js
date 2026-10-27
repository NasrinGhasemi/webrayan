"use client";

function pageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export default function AdminPagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}) {
  if (!total) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const btn =
    "px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all";

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 font-vazir" dir="rtl">
      <p className="text-xs text-slate-500">
        نمایش {from.toLocaleString("fa-IR")} تا {to.toLocaleString("fa-IR")} از{" "}
        {total.toLocaleString("fa-IR")} مورد
      </p>

      {totalPages > 1 && (
        <nav className="flex items-center gap-1" aria-label="صفحه‌بندی">
          <button className={btn} disabled={page <= 1} onClick={() => onPageChange(1)}>«</button>
          <button className={btn} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>قبلی</button>
          {pageNumbers(page, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`e${i}`} className="px-2 text-slate-400">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`min-w-[2.25rem] px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  p === page
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p.toLocaleString("fa-IR")}
              </button>
            ),
          )}
          <button className={btn} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>بعدی</button>
          <button className={btn} disabled={page >= totalPages} onClick={() => onPageChange(totalPages)}>»</button>
        </nav>
      )}

      {onPageSizeChange && (
        <label className="flex items-center gap-2 text-xs text-slate-500">
          در هر صفحه
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>{n.toLocaleString("fa-IR")}</option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
