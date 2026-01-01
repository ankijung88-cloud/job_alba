import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiArrowLeft, FiSave } from "react-icons/fi";

interface UserAccount {
    id: string;
    password: string;
    name: string;
    phone: string;
    email: string;
    intro: string;
    role: "USER";
}

export default function UserProfileEdit() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        id: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        email: "",
        intro: "",
    });

    useEffect(() => {
        // 1. 현재 로그인된 사용자 정보 불러오기
        const userProfileStr = localStorage.getItem("userProfile");
        if (!userProfileStr) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/Login");
            return;
        }

        const userProfile: UserAccount = JSON.parse(userProfileStr);

        // 2. 폼 초기값 설정 (비밀번호는 보안상 빈값 처리하거나, 확인용으로 비워둠)
        setForm({
            id: userProfile.id,
            password: userProfile.password, // 편의상 기존 비번 표시 (실무에선 비워두고 재입력 유도 권장)
            confirmPassword: userProfile.password,
            name: userProfile.name,
            phone: userProfile.phone,
            email: userProfile.email,
            intro: userProfile.intro,
        });
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. 유효성 검사
        if (!form.password) {
            alert("비밀번호는 필수입니다.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!form.name || !form.phone || !form.id) {
            alert("필수 정보를 모두 입력해주세요.");
            return;
        }

        // 2. 데이터 업데이트 준비
        const usersStr = localStorage.getItem("db_users");
        const users = usersStr ? JSON.parse(usersStr) : {};

        // 현재 로그인된 프로필
        const userProfileStr = localStorage.getItem("userProfile");
        const userProfile = userProfileStr ? JSON.parse(userProfileStr) : null;
        if (!userProfile) return;

        const oldId = userProfile.id;
        const newId = form.id;
        const oldEmail = userProfile.email;
        const newEmail = form.email;

        // ID 변경 시 중복 체크
        if (newId !== oldId && users[newId]) {
            alert("이미 존재하는 아이디입니다. 다른 아이디를 사용해주세요.");
            return;
        }

        // 3. 사용자 객체 생성
        const updatedUser: UserAccount = {
            id: newId,
            password: form.password,
            name: form.name,
            phone: form.phone,
            email: newEmail,
            intro: form.intro,
            role: "USER",
        };

        // 4. DB 업데이트 (Re-keying if ID changed)
        if (newId !== oldId) {
            delete users[oldId]; // 구 ID 삭제
            users[newId] = updatedUser; // 신 ID 추가
        } else {
            users[newId] = updatedUser; // 덮어쓰기
        }

        // 5. 이메일(식별자) 변경 시 지원 내역 업데이트 (db_applications userId)
        if (newEmail !== oldEmail) {
            const appsStr = localStorage.getItem("db_applications");
            if (appsStr) {
                const apps = JSON.parse(appsStr);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const updatedApps = apps.map((app: any) => {
                    if (app.userId === oldEmail) {
                        return { ...app, userId: newEmail, applicantEmail: newEmail, applicantName: form.name, applicantPhone: form.phone };
                    }
                    return app;
                });
                localStorage.setItem("db_applications", JSON.stringify(updatedApps));
            }
        } else {
            // 이메일은 같지만 이름/전화번호가 바뀌었을 수 있으므로 지원정보 동기화
            const appsStr = localStorage.getItem("db_applications");
            if (appsStr) {
                const apps = JSON.parse(appsStr);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const updatedApps = apps.map((app: any) => {
                    if (app.userId === oldEmail) { // userId는 email이라고 가정
                        return { ...app, applicantName: form.name, applicantPhone: form.phone };
                    }
                    return app;
                });
                localStorage.setItem("db_applications", JSON.stringify(updatedApps));
            }
        }

        // 6. 저장
        localStorage.setItem("db_users", JSON.stringify(users));
        localStorage.setItem("userProfile", JSON.stringify(updatedUser)); // 세션 업데이트

        alert("회원정보가 성공적으로 수정되었습니다.");

        // ID가 바뀌었으면 재로그인 유도 or 그대로 유지
        if (newId !== oldId) {
            alert("아이디가 변경되어 재로그인이 필요합니다.");
            localStorage.removeItem("role");
            localStorage.removeItem("userProfile");
            navigate("/Login");
        } else {
            navigate("/UserLanding");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black italic mb-2">My Profile</h1>
                    <p className="text-gray-500">개인 회원 정보를 수정합니다.</p>
                </div>

                <div className="flex bg-blue-50 rounded-xl p-4 mb-8 items-center gap-4 border border-blue-100">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                        <FiUser />
                    </div>
                    <div>
                        <p className="text-sm text-blue-600 font-bold">현재 로그인 계정</p>
                        <input
                            type="text"
                            name="id"
                            value={form.id}
                            onChange={handleChange}
                            className="font-bold text-gray-800 text-lg bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-600 w-full"
                        />
                        <p className="text-xs text-blue-400 mt-1">* 아이디 수정 가능</p>
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
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="비밀번호"
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
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="비밀번호 확인"
                                required
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100 my-6" />

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="본명"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">연락처</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="010-0000-0000"
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
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="example@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">한줄 소개</label>
                        <input
                            type="text"
                            name="intro"
                            value={form.intro}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="자신을 소개해주세요"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 mt-8 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <FiSave /> 정보 수정 저장
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/UserLanding")}
                        className="text-gray-500 font-bold hover:text-gray-900 flex items-center justify-center gap-2 mx-auto"
                    >
                        <FiArrowLeft /> 홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
