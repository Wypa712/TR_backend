import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";


export default function Registration() {
  const navigate = useNavigate();

  // const isAuth = useAuthStore((state) => state.isAuth);


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
      console.log(result.error);
    }
  };

  return (
    <div className="flex max-w-2xl min-h-screen mx-auto items-center">
      <div className="flex-col justify-center text-center w-full">
        <h1 className="text-3xl mb-4 font-bold">Register page</h1>
        <form
          onSubmit={onSubmit}
          className="bg-base-200 min-w-xl mx-auto p-8 border rounded-2xl shadow-2xl"
        >
          <div className="flex flex-col gap-4">
            {error && <div className="alert alert-error text-sm">{error}</div>}

            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="User name"
              required
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />

            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="btn btn-primary w-full mt-4">
              Register
            </button>
            <Link to="/login">
              <p>Вже маєте акаунт?</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
