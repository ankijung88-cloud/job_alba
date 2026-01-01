import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiArrowLeft, FiSave } from "react-icons/fi";
import type { Job } from "../../types/job";

interface CompanyAccount {
    id: string;
    password: string;
    companyName: string;
    regNumber: string;
    contactPerson: string;
    description: string;
    role: "COMPANY";
}

export default function CompanyProfileEdit() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        id: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        regNumber: "",
        contactPerson: "",
        description: "",
    });

    useEffect(() => {
        const companyProfileStr = localStorage.getItem("companyProfile");
        if (!companyProfileStr) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/Login");
            return;
        }

        const companyProfile: CompanyAccount = JSON.parse(companyProfileStr);

        setForm({
            id: companyProfile.id,
            password: companyProfile.password,
            confirmPassword: companyProfile.password,
            companyName: companyProfile.companyName,
            regNumber: companyProfile.regNumber,
            contactPerson: companyProfile.contactPerson,
            description: companyProfile.description,
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
        if (!form.companyName || !form.regNumber || !form.id) {
            alert("필수 정보를 모두 입력해주세요.");
            return;
        }

        // 2. Load DB
        const companiesStr = localStorage.getItem("db_companies");
        const companies = companiesStr ? JSON.parse(companiesStr) : {};

        const companyProfileStr = localStorage.getItem("companyProfile");
        const companyProfile = companyProfileStr ? JSON.parse(companyProfileStr) : null;
        if (!companyProfile) return;

        const oldId = companyProfile.id;
        const newId = form.id;
        const oldName = companyProfile.companyName;
        const newName = form.companyName;

        // ID 중복 체크 (변경 시)
        if (newId !== oldId && companies[newId]) {
            alert("이미 존재하는 아이디입니다.");
            return;
        }

        // 3. New Object
        const updatedCompany: CompanyAccount = {
            id: newId,
            password: form.password,
            companyName: form.companyName,
            regNumber: form.regNumber,
            contactPerson: form.contactPerson,
            description: form.description,
            role: "COMPANY",
        };

        // 4. Update Companies DB
        if (newId !== oldId) {
            delete companies[oldId];
            companies[newId] = updatedCompany;
        } else {
            companies[newId] = updatedCompany;
        }

        // 5. Update Jobs (if Company Name changed)
        // Job interface uses 'company' (string name) as the reference.
        if (newName !== oldName) {
            const jobsStr = localStorage.getItem("db_jobs");
            if (jobsStr) {
                const jobs: Job[] = JSON.parse(jobsStr);
                const updatedJobs = jobs.map(job => {
                    if (job.company === oldName) {
                        return { ...job, company: newName };
                    }
                    return job;
                });
                localStorage.setItem("db_jobs", JSON.stringify(updatedJobs));
            }
        }

        // 6. Save
        localStorage.setItem("db_companies", JSON.stringify(companies));
        localStorage.setItem("companyProfile", JSON.stringify(updatedCompany));

        alert("기업 정보가 성공적으로 수정되었습니다.");

        if (newId !== oldId) {
            alert("아이디가 변경되어 재로그인이 필요합니다.");
            localStorage.removeItem("role");
            localStorage.removeItem("companyProfile");
            navigate("/Login");
        } else {
            navigate("/CompanyLanding");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black italic mb-2">Company Profile</h1>
                    <p className="text-gray-500">기업 정보를 수정합니다.</p>
                </div>

                <div className="flex bg-indigo-50 rounded-xl p-4 mb-8 items-center gap-4 border border-indigo-100">
                    <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                        <FiBriefcase />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-indigo-600 font-bold">현재 기업 계정 ID</p>
                        <input
                            type="text"
                            name="id"
                            value={form.id}
                            onChange={handleChange}
                            className="font-bold text-gray-800 text-lg bg-transparent border-b border-indigo-300 focus:outline-none focus:border-indigo-600 w-full"
                        />
                        <p className="text-xs text-indigo-400 mt-1">* 아이디 수정 가능</p>
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
                                required
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100 my-6" />

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">기업명</label>
                        <input
                            type="text"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">사업자등록번호</label>
                        <input
                            type="text"
                            name="regNumber"
                            value={form.regNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">담당자명</label>
                        <input
                            type="text"
                            name="contactPerson"
                            value={form.contactPerson}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">기업 소개</label>
                        <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 mt-8 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <FiSave /> 정보 수정 저장
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/CompanyLanding")}
                        className="text-gray-500 font-bold hover:text-gray-900 flex items-center justify-center gap-2 mx-auto"
                    >
                        <FiArrowLeft /> 홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
