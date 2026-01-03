import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiArrowRight, FiSettings } from "react-icons/fi";

function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        id: "",
        password: "",
    });

    // Init Admin DB Logic (Self-Healing)
    useEffect(() => {
        const adminStr = localStorage.getItem("db_admin");
        const defaultAdmin = {
            id: "admin",
            password: "admin1234",
            name: "최고관리자",
            email: "admin@jobalba.com",
            role: "ADMIN"
        };

        if (!adminStr) {
            // Missing -> Create
            localStorage.setItem("db_admin", JSON.stringify(defaultAdmin));
        } else {
            // Exists -> Validate Integrity
            try {
                const admin = JSON.parse(adminStr);
                // 필수 필드 검증
                if (!admin.id || !admin.password || !admin.role) {
                    console.warn("db_admin corrupted. Restoring default.");
                    localStorage.setItem("db_admin", JSON.stringify(defaultAdmin));
                }
            } catch (e) {
                console.error("db_admin JSON parse error. Restoring default.", e);
                localStorage.setItem("db_admin", JSON.stringify(defaultAdmin));
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.id || !form.password) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        const adminStr = localStorage.getItem("db_admin");
        const admin = adminStr ? JSON.parse(adminStr) : null;

        if (admin && admin.id === form.id && admin.password === form.password) {
            localStorage.setItem("role", "ADMIN");
            localStorage.setItem("adminProfile", JSON.stringify(admin)); // 세션 저장
            alert(`관리자 모드로 접속합니다. (${admin.name})`);
            navigate("/admin/dashboard");
        } else {
            alert("관리자 정보가 일치하지 않습니다.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 translate-x-1/2 translate-y-1/2"></div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 relative z-10">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <FiSettings className="text-3xl text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-1 italic">JOB-ALBA</h1>
                    <p className="text-blue-200 text-sm font-medium tracking-widest uppercase">Admin System</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Admin ID</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="id"
                                value={form.id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition-all outline-none text-sm placeholder-gray-500"
                                placeholder="관리자 아이디"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition-all outline-none text-sm placeholder-gray-500"
                                placeholder="비밀번호"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
                    >
                        관리자 로그인 <FiArrowRight />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button onClick={() => navigate("/")} className="text-gray-400 text-sm hover:text-white transition-colors">
                        ← 메인으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
