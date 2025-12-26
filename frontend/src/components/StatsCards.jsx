import CountUp from "react-countup";

const AnimatedNumber = ({ value, colorClass, prefix = "", suffix = " $" }) => (
  <CountUp
    end={value || 0}
    duration={1.5}
    separator=" "
    prefix={prefix}
    suffix={suffix}
    className={colorClass}
  />
);

export default function StatsCards({ stats, loading, reserve, setReserve }) {
  const calculateDailyBudget = () => {
    if (!stats || stats.balans <= 0) return 0;

    const now = new Date();
    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const daysRemaining = lastDay - now.getDate() + 1;

    const availableMoney = stats.balans - reserve;
    const daily = availableMoney / daysRemaining;

    return daily > 0 ? daily.toFixed(2) : 0;
  };

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-28 w-full rounded-2xl"></div>
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Текущий баланс */}
      <div className="stat bg-base-100 shadow rounded-2xl border border-base-200 px-4 py-3">
        <div className="stat-title font-medium opacity-70">Текущий баланс</div>
        <div className="stat-value text-primary text-2xl">
          <AnimatedNumber value={stats?.balans} />
        </div>
      </div>

      {/* Бюджет на день */}
      <div className="stat bg-base-100 shadow rounded-2xl border border-base-200 px-4 py-3 relative overflow-hidden">
        <div className="stat-title font-medium opacity-70 text-secondary">
          На день (за вычетом резерва)
        </div>
        <div className="flex items-center gap-2">
          <div className="stat-value text-secondary text-2xl">
            <AnimatedNumber value={calculateDailyBudget()} />
          </div>
          <div className="stat-desc mt-1 flex items-center gap-1 flex-wrap">
            <span className="opacity-70">Резерв:</span>
            <input
              type="number"
              className="input input-ghost input-xs p-0 font-bold text-base-content focus:bg-base-200 focus:outline-none transition-all text-center"
              style={{
                width: `${Math.max(2, reserve.toString().length) + 1}ch`,
                minWidth: "20px",
              }}
              value={reserve === 0 ? "" : reserve}
              onChange={(e) => {
                const val = e.target.value;
                setReserve(val === "" ? 0 : Number(val));
              }}
              placeholder="0"
            />
            <span className="font-bold">$</span>
          </div>
        </div>
      </div>

      {/* Доходы */}
      <div className="stat bg-base-100 shadow rounded-2xl border border-base-200 px-4 py-3">
        <div className="stat-title font-medium opacity-70">Всего доходов</div>
        <div className="stat-value text-success text-2xl">
          <AnimatedNumber value={stats?.income} prefix="+ " />
        </div>
      </div>

      {/* Расходы */}
      <div className="stat bg-base-100 shadow rounded-2xl border border-base-200 px-4 py-3">
        <div className="stat-title font-medium opacity-70">Всего расходов</div>
        <div className="stat-value text-error text-2xl">
          <AnimatedNumber value={stats?.expense} prefix="- " />
        </div>
      </div>
    </div>
  );
}
