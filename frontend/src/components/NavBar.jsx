import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const { isAuth, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-2 sm:px-4">
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost px-2 text-lg sm:text-xl font-bold gap-1"
        >
          <span>💰</span>
          <span className="hidden xs:inline-block">FinanceTracker</span>
        </Link>
      </div>

      <div className="flex-none gap-1 sm:gap-2">
        {isAuth ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm sm:text-base font-medium max-w-[100px] sm:max-w-none truncate">
              <span className="hidden sm:inline">Привіт, </span>
              {user?.username}
            </span>

            <button
              onClick={handleLogout}
              className="btn btn-error btn-outline btn-xs sm:btn-sm"
            >
              <span className="hidden xs:inline">Выйти</span>
              <span className="xs:hidden">✕</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-1">
            <Link to="/login" className="btn btn-ghost btn-xs sm:btn-sm">
              Увійти
            </Link>
            <Link to="/register" className="btn btn-primary btn-xs sm:btn-sm">
              Зареєструватися
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
