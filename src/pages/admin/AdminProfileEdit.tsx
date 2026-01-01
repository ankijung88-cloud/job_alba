import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSettings, FiArrowLeft, FiSave } from "react-icons/fi";

interface AdminAccount {
    id: string;
    password: string;
    name: string;
    email: string;
    role: "ADMIN";
}

export default function AdminProfileEdit() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        id: "",
        password: "",
        confirmPassword: "",
        name: "",
        email: "",
    });

    useEffect(() => {
        // Load session
        const adminProfileStr = localStorage.getItem("adminProfile");
        if (!adminProfileStr) {
            alert("관리자 로그인이 필요합니다.");
            navigate("/Login");
            return;
        }
        const adminProfile: AdminAccount = JSON.parse(adminProfileStr);

        setForm({
            id: adminProfile.id,
            password: adminProfile.password,
            confirmPassword: adminProfile.password,
            name: adminProfile.name,
            email: adminProfile.email,
        });
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!form.password) {
            alert("비밀번호는 필수입니다.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!form.id || !form.name) {
            alert("필수 정보를 입력해주세요.");
            return;
        }

        // Load Current DB
        // Note: Currently we only support 1 admin for simplicity in this file,
        // but logic supports replacing the object at 'db_admin'.
        // If we wanted multiple admins, we'd use a dict like db_users.
        // For now, let's assume single admin object in db_admin for simplicity as per Login logic.
        // Wait, Login logic checks `localStorage.getItem("db_admin")` as a single object?
        // In Login.tsx: localStorage.setItem("db_admin", JSON.stringify(defaultAdmin)); -> It saves a SINGLE OBJECT.

        const newAdmin: AdminAccount = {
            id: form.id,
            password: form.password,
            name: form.name,
            email: form.email,
            role: "ADMIN"
        };

        localStorage.setItem("db_admin", JSON.stringify(newAdmin));
        localStorage.setItem("adminProfile", JSON.stringify(newAdmin));

        alert("관리자 정보가 수정되었습니다.");
        navigate("/admin/dashboard");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black italic mb-2">Admin Profile</h1>
                    <p className="text-gray-500">최고 관리자 정보를 수정합니다.</p>
                </div>

                <div className="flex bg-gray-100 rounded-xl p-4 mb-8 items-center gap-4 border border-gray-200">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl">
                        <FiSettings />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-gray-600 font-bold">관리자 ID</p>
                        <input
                            type="text"
                            name="id"
                            value={form.id}
                            onChange={handleChange}
                            className="font-bold text-gray-900 text-lg bg-transparent border-b border-gray-300 focus:outline-none focus:border-gray-900 w-full"
                        />
                        <p className="text-xs text-gray-400 mt-1">* ID 수정 가능</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">비밀번호</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">비밀번호 확인</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100 my-6" />

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">관리자명</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 mt-8 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <FiSave /> 관리자 정보 저장
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-gray-500 font-bold hover:text-gray-900 flex items-center justify-center gap-2 mx-auto"
                    >
                        <FiArrowLeft /> 대시보드로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
