export default function TransactionTable({
  transactions,
  onDelete,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
}) {
  return (
    <>
      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200">
        <div className="relative w-full md:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40">
            🔍
          </span>
          <input
            type="text"
            placeholder="Пошук операції..."
            className="input input-bordered w-full pl-10 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="tabs tabs-boxed">
          {["all", "income", "expense"].map((type) => (
            <button
              key={type}
              className={`tab ${
                filterType === type ? "tab-active !bg-primary !text-white" : ""
              }`}
              onClick={() => setFilterType(type)}
            >
              {type === "all"
                ? "Всі"
                : type === "income"
                ? "Доходи"
                : "Витрати"}
            </button>
          ))}
        </div>
      </div>

      {/* Table Area */}
      <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th>Дата</th>
                <th>Категорія</th>
                <th className="hidden md:table-cell">Опис</th>{" "}
                {/* Показуємо тільки на md і вище */}
                <th className="text-right">Сума</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((el) => (
                <tr
                  key={el.id}
                  className="hover:bg-base-200/30 transition-colors"
                >
                  <td className="text-sm opacity-70">
                    {new Date(el.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="badge badge-outline badge-sm md:badge-md opacity-80">
                      {el.category}
                    </span>
                  </td>
                  {/* Колонка з описом */}
                  <td className="hidden md:table-cell max-w-xs truncate text-sm">
                    {el.description || (
                      <span className="opacity-20 italic">Немає опису</span>
                    )}
                  </td>
                  <td
                    className={`text-right font-bold ${
                      el.type === "expense" ? "text-error" : "text-success"
                    }`}
                  >
                    {el.type === "expense" ? "-" : "+"}{" "}
                    {Math.abs(el.amount).toLocaleString()} $
                  </td>
                  <td>
                    <button
                      onClick={() => onDelete(el.id)}
                      className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                      title="Видалити"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-10 opacity-40 italic">
              Транзакцій не знайдено
            </div>
          )}
        </div>
      </div>
    </>
  );
}
