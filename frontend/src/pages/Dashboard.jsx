import { useEffect, useState } from "react";
import transactionService from "../api/services/transactionService";
import AddTransactionModal from "../components/AddTransactionModal";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState({ message: [] });

  const fetchStats = async () => {
    // Включаем скелетон только при первой загрузке
    if (!stats) setLoading(true);

    try {
      // Искусственная задержка для плавности
      const delay = new Promise((resolve) => setTimeout(resolve, 800));

      const [statData, transData] = await Promise.all([
        transactionService.getStats(),
        transactionService.getTransactions(),
        delay,
      ]);

      setStats(statData);
      setTransactions(transData || { message: [] });
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    const previousState = { ...transactions };
    setTransactions({
      ...transactions,
      message: transactions.message.filter((t) => t.id !== id),
    });

    try {
      await transactionService.daleteTransactions(id);
      fetchStats(); 
    } catch (error) {
      setTransactions(previousState);
      console.error("Ошибка при удалении:", error);
    }
  };

  const prepareChartData = () => {
    const summary = {};
    const expenses =
      transactions?.message?.filter((t) => t.type === "expense") || [];

    expenses.forEach((t) => {
      summary[t.category] = (summary[t.category] || 0) + Number(t.amount);
    });

    return Object.keys(summary).map((key) => ({
      name: key,
      value: summary[key],
    }));
  };

  const chartData = prepareChartData();

  return (
    <div className="p-4 md:p-6 bg-base-200 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Мои Финансы</h1>
        <button
          className="btn btn-primary w-full sm:w-auto shadow-lg"
          onClick={() => document.getElementById("add_modal").showModal()}
        >
          <span className="text-xl">+</span> Добавить операцию
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-28 w-full rounded-2xl"></div>
          ))
        ) : (
          <>
            <div className="stat bg-base-100 shadow rounded-2xl border border-base-200">
              <div className="stat-title font-medium text-base-content/70">
                Текущий баланс
              </div>
              <div className="stat-value text-primary text-2xl lg:text-3xl">
                {stats?.balans?.toLocaleString()} $
              </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-2xl border border-base-200">
              <div className="stat-title font-medium text-base-content/70">
                Всего доходов
              </div>
              <div className="stat-value text-success text-2xl lg:text-3xl">
                +{stats?.income?.toLocaleString()} $
              </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-2xl border border-base-200">
              <div className="stat-title font-medium text-base-content/70">
                Всего расходов
              </div>
              <div className="stat-value text-error text-2xl lg:text-3xl">
                -{stats?.expense?.toLocaleString()} $
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Аналитика расходов</h2>
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-base-content/40 italic">
                  Добавьте расходы, чтобы увидеть график
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content p-8 shadow-xl relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              Совет дня 💡
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              {chartData.length > 0 ? (
                <>
                  Ваша самая затратная категория —{" "}
                  <span className="font-black underline">
                    {chartData[0].name}
                  </span>
                  . Попробуйте установить лимит на эту категорию в следующем
                  месяце, чтобы сэкономить до 15% бюджета.
                </>
              ) : (
                "Начните записывать свои расходы, чтобы наша система могла проанализировать ваши привычки и дать дельный совет!"
              )}
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl rounded-2xl overflow-hidden border border-base-200">
        <div className="p-6 border-b border-base-200 flex justify-between items-center bg-base-50">
          <h2 className="text-xl font-bold">История операций</h2>
          <span className="badge badge-lg badge-ghost font-bold">
            {transactions?.message?.length || 0} зап.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/50 text-sm uppercase">
                <th>Дата</th>
                <th>Категория</th>
                <th className="hidden md:table-cell">Описание</th>
                <th className="text-right">Сумма</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5">
                        <div className="skeleton h-8 w-full"></div>
                      </td>
                    </tr>
                  ))
                : transactions?.message?.map((el) => (
                    <tr
                      key={el.id}
                      className="hover:bg-base-200/30 transition-colors"
                    >
                      <td className="text-sm opacity-70">
                        {new Date(el.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="badge badge-outline badge-sm md:badge-md opacity-80 font-medium text-xs">
                          {el.category}
                        </span>
                      </td>
                      <td className="hidden md:table-cell max-w-xs truncate text-sm">
                        {el.description || (
                          <span className="opacity-30 italic">N/A</span>
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
                          onClick={() => handleDelete(el.id)}
                          className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                          title="Удалить"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {!loading && transactions?.message?.length === 0 && (
            <div className="text-center py-16 text-base-content/40 flex flex-col items-center gap-2">
              <span className="text-4xl">📁</span>
              <p className="text-lg">Транзакций пока нет</p>
            </div>
          )}
        </div>
      </div>

      <AddTransactionModal onTransactionAdded={fetchStats} />
    </div>
  );
}
