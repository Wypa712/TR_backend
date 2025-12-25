import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import transactionService from "../api/services/transactionService";
import { useEffect, useState } from "react";

export default function Home() {
  const isAuth = useAuthStore((state) => state.isAuth);
  // Ініціалізуємо нулями, щоб не було помилок при першому рендері
  const [stats, setStats] = useState({ transactions: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await transactionService.getGlobalStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Не вдалося завантажити статистику", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-base-200 px-4">
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
              <Link
                to="/dashboard"
                className="btn btn-primary btn-wide shadow-lg"
              >
                Перейти до дашборду
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  className="btn btn-primary btn-wide shadow-md"
                  to="/register"
                >
                  Почати безкоштовно
                </Link>
                <Link
                  className="btn btn-ghost btn-wide underline decoration-primary"
                  to="/login"
                >
                  Увійти
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section - Твій новий блок */}
      <div className="py-10 bg-base-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full border border-base-300">
            <div className="stat place-items-center">
              <div className="stat-title">Користувачів</div>
              <div className="stat-value text-primary">{stats.users}</div>
              <div className="stat-desc">Вже з нами</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Транзакцій</div>
              <div className="stat-value text-secondary">
                {stats.transactions}
              </div>
              <div className="stat-desc">Записано в системі</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">Надійність</div>
              <div className="stat-value text-accent">99.9%</div>
              <div className="stat-desc">Доступність сервісу</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-base-200/50 flex-grow">
        <h2 className="text-3xl font-bold text-center mb-12">Чому саме ми?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-xl border border-base-300 hover:scale-105 transition-transform">
            <div className="card-body items-center text-center">
              <span className="text-5xl mb-2">📊</span>
              <h2 className="card-title text-primary">Наочна статистика</h2>
              <p className="text-sm opacity-70">
                Графіки та звіти допоможуть зрозуміти твою фінансову поведінку.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-300 hover:scale-105 transition-transform">
            <div className="card-body items-center text-center">
              <span className="text-5xl mb-2">📱</span>
              <h2 className="card-title text-primary">Завжди під рукою</h2>
              <p className="text-sm opacity-70">
                Додаток працює на будь-якому пристрої. Додавай витрати миттєво.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-300 hover:scale-105 transition-transform">
            <div className="card-body items-center text-center">
              <span className="text-5xl mb-2">🔒</span>
              <h2 className="card-title text-primary">Безпека даних</h2>
              <p className="text-sm opacity-70">
                Твої дані зашифровані та зберігаються в надійній базі
                PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content">
        <div>
          <p className="font-bold text-lg">FinanceTracker</p>
          <p>Copyright © 2025 - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
