import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import transactionService from "../api/services/transactionService";
import { useEffect, useState } from "react";

export default function Home() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const [stats, setStats] = useState({transactions: 0, users: 0});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await transactionService.getGlobalStats();

        if (res.data.success) {
          setStats(res.data.data);
        }

        console.log(stats)
      } catch (error) {
        console.error("Не удалось загрузить статку", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-200 px-4">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary">
              💰 FinanceTracker
            </h1>
            <p className="py-6 text-base sm:text-lg opacity-80">
              Перестань гадати, куди йдуть гроші. Почни записувати витрати
              сьогодні та стань господарем свого бюджету!
            </p>

            {isAuth ? (
              <div className="flex justify-center">
                <Link
                  to="/dashboard"
                  className="btn btn-primary btn-wide shadow-lg"
                >
                  Перейти до дашборду
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
                <Link
                  className="btn btn-primary btn-wide sm:btn-md shadow-md"
                  to="/register"
                >
                  Почати безкоштовно
                </Link>
                <Link
                  className="btn btn-ghost btn-wide sm:btn-md underline decoration-primary"
                  to="/login"
                >
                  Увійти
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 sm:py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Чому саме ми?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="card bg-base-100 shadow-xl border border-base-300 hover:scale-105 transition-transform">
            <div className="card-body items-center text-center">
              <span className="text-5xl mb-2">📊</span>
              <h2 className="card-title text-primary">Наочна статистика</h2>
              <p className="text-sm opacity-70">
                Графіки та звіти допоможуть зрозуміти твою фінансову поведінку в
                деталях.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card bg-base-100 shadow-xl border border-base-300 hover:scale-105 transition-transform">
            <div className="card-body items-center text-center">
              <span className="text-5xl mb-2">📱</span>
              <h2 className="card-title text-primary">Завжди під рукою</h2>
              <p className="text-sm opacity-70">
                Додаток працює як на ПК, так і на смартфоні. Додавай витрати на
                ходу.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card bg-base-100 shadow-xl border border-base-300 hover:scale-105 transition-transform">
            <div className="card-body items-center text-center">
              <span className="text-5xl mb-2">🔒</span>
              <h2 className="card-title text-primary">Безпека даних</h2>
              <p className="text-sm opacity-70">
                Ми використовуємо сучасне шифрування, щоб твої фінанси
                залишалися тільки твоїми.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="stat-value">{stats.users}</div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content rounded-t-3xl">
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg">FinanceTracker</p>
          <p>Керуй грошима розумно.</p>
          <p className="text-xs opacity-50 mt-4">
            Copyright © 2025 - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
