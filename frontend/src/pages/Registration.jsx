import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";

export default function Registration() {
  const navigate = useNavigate();
  const registerAction = useAuthStore((state) => state.registration);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await registerAction({ email, username, password });

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
    }
  };

  return (
    // Центруємо форму і додаємо відступи по боках для мобільних
    <div className="flex min-h-[calc(100vh-64px)] mx-auto items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl mb-6 font-bold text-center">Створити акаунт</h1>
        
        <form
          onSubmit={onSubmit}
          className="bg-base-200 p-6 sm:p-8 border border-base-300 rounded-2xl shadow-xl"
        >
          <div className="flex flex-col gap-3">
            {error && (
              <div className="alert alert-error text-sm py-2 shadow-sm mb-2">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text">Ім'я користувача</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full focus:input-primary"
                placeholder="Ivan_Ivanov"
                required
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full focus:input-primary"
                placeholder="mail@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text">Пароль</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full focus:input-primary"
                placeholder="Мінімум 6 символів"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-6 text-lg">
              Зареєструватися
            </button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="link link-hover text-sm opacity-70">
                Вже маєте акаунт? Увійти
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}