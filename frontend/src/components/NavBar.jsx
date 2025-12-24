import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const { isAuth, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  console.log("USER OBJECT:", user);    
  return (
    <div className="navbar bg-base-100 shadow-md px-4">

      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          💰 FinanceTracker
        </Link>
      </div>

      <div className="flex-none gap-2">
        {isAuth ? (
          // Если залогинен
          <div className="flex items-center gap-4">
            <span className="font-medium">Привет, {user?.username}!</span>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-error btn-sm"
            >
              Выйти
            </button>
          </div>
        ) : (
          // Если гость
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Войти
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
