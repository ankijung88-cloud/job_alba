import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (role: "USER" | "COMPANY") => {
    localStorage.setItem("role", role);

    if (role === "COMPANY") {
      navigate("/CompanyLanding");
    } else {
      navigate("/UserLanding");
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-bold">JOB-ALBA</h2>

      <div className="flex gap-4">
        <button
          onClick={() => handleLogin("USER")}
          className="px-6 py-3 bg-blue-600 text-white rounded-md"
        >
          개인 로그인
        </button>

        <button
          onClick={() => handleLogin("COMPANY")}
          className="px-6 py-3 bg-gray-800 text-white rounded-md"
        >
          기업 로그인
        </button>
      </div>
    </div>
  );
}

export default Login;
