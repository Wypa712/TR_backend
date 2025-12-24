import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const loginAction = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await loginAction({ email, password });
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    // Змінив px-4, щоб на мобільних форма не торкалася країв екрана
    <div className="flex min-h-[calc(100vh-64px)] mx-auto items-center justify-center px-4">
      {/* max-w-md достатньо для форми входу */}
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl mb-6 font-bold text-center">
          Вхід у систему
        </h1>

        <form
          onSubmit={onSubmit}
          // Зменшив p-6 на мобільних, p-8 на десктопі
          className="bg-base-200 p-6 sm:p-8 border border-base-300 rounded-2xl shadow-xl"
        >
          <div className="flex flex-col gap-4">
            {error && (
              <div className="alert alert-error text-sm py-2 shadow-sm">
                <span>{error}</span>
              </div>
            )}

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
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4 text-lg"
            >
              Увійти
            </button>

            <div className="text-center mt-2">
              <Link
                to="/register"
                className="link link-hover text-sm opacity-70"
              >
                Ще не маєте акаунта? Реєстрація
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
