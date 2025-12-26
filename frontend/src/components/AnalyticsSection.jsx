import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export default function AnalyticsSection({ chartData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
        <h2 className="text-xl font-bold mb-6">Аналітика витрат</h2>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center opacity-40">Немає даних</p>
          )}
        </div>
      </div>
      {/* Порада дня (можна теж винести або лишити тут) */}
      <div className="card bg-neutral text-neutral-content p-8 shadow-xl">
        <h2 className="text-2xl font-black  mb-4">Порада дня 💡</h2>
        <p className="text-lg opacity-90">
          {chartData.length > 0
            ? `Ваша найбільша категорія: ${chartData[0].name}. Спробуйте скоротити витрати тут на 10%.`
            : "Додайте перші витрати для аналізу."}
        </p>
      </div>
    </div>
  );
}
