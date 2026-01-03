import { useState, useEffect } from "react";
import { FiTrash2, FiEdit2, FiSearch, FiDownload, FiUser, FiPhone, FiMail, FiLogOut, FiSettings, FiX, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ResumeView from "../../components/ResumeView";
import type { Job } from "../../types/job";

export interface Application {
    id: string;
    jobId: string | number;
    userId: string;
    applicantName: string;
    applicantPhone: string;
    applicantEmail: string;
    appliedAt: string;
    status: "pending" | "viewed" | "accepted" | "rejected";
    memo?: string;
    adminChecked?: boolean;
    processStatus?: "INTERVIEW_SCHEDULED" | "INTERVIEW_COMPLETED" | "HIRED";
    interviewDate?: string;
}

export interface Proposal {
    id: string;
    companyId: string;
    companyName: string;
    userId: string;
    userName: string;
    type: "HIRING" | "INTERVIEW";
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    adminChecked?: boolean;
    processStatus?: "INTERVIEW_SCHEDULED" | "INTERVIEW_COMPLETED" | "HIRED";
    interviewDate?: string;
}

interface UserAccount {
    id: string;
    name: string;
    phone: string;
    email: string;
    processStatus?: "INTERVIEW_SCHEDULED" | "INTERVIEW_COMPLETED" | "HIRED";
    interviewDate?: string;
    hiredAt?: string;
    memberNumber?: string;
}

interface CompanyAccount {
    id: string;
    companyName: string;
    contactPerson: string;
    contactPosition?: string;
    contactPhone?: string;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [users, setUsers] = useState<Record<string, UserAccount>>({});
    const [companies, setCompanies] = useState<Record<string, CompanyAccount>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"APPLICATIONS" | "PROPOSALS" | "HIRED" | "MEMBERS">("APPLICATIONS");
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Helper: Generate Member Number
    const generateMemberNumber = () => {
        const date = new Date();
        const dateStr = date.getFullYear().toString().slice(2) + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `M${dateStr}-${random}`;
    };

    // Backfill Member Numbers on Mount
    useEffect(() => {
        let usersUpdated = false;
        let companiesUpdated = false;

        const usersStr = localStorage.getItem("db_users");
        const companiesStr = localStorage.getItem("db_companies");

        // Use loose typing to allow adding properties
        const currentUsers = usersStr ? JSON.parse(usersStr) : {};
        const currentCompanies = companiesStr ? JSON.parse(companiesStr) : {};

        // Backfill Users
        Object.keys(currentUsers).forEach(key => {
            if (!currentUsers[key].memberNumber) {
                currentUsers[key].memberNumber = generateMemberNumber();
                usersUpdated = true;
            }
        });

        // Backfill Companies
        Object.keys(currentCompanies).forEach(key => {
            if (!currentCompanies[key].memberNumber) {
                currentCompanies[key].memberNumber = generateMemberNumber();
                companiesUpdated = true;
            }
        });

        if (usersUpdated) {
            localStorage.setItem("db_users", JSON.stringify(currentUsers));
            setUsers(currentUsers); // Update local state if we had setUsers, but we initialize from localStorage in own effect. 
            // Actually AdminDashboard treats localStorage as source of truth for init but maintains its own state?
            // Let's check how state is initialized.
            // It seems AdminDashboard initializes `users` via `const [users, setUsers] = useState<Record<string, UserAccount>>({});` and then loads in useEffect.
            // So we should do this BEFORE setting the initial state or update the state after.
            // Let's put this logic inside the initial load useEffect.
        }
        if (companiesUpdated) {
            localStorage.setItem("db_companies", JSON.stringify(currentCompanies));
        }
    }, []); // Run once on mount BEFORE loading data into state


    // Selection State
    const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());
    const [selectedPropIds, setSelectedPropIds] = useState<Set<string>>(new Set());

    // Resume Modal State
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [selectedResumeUser, setSelectedResumeUser] = useState<any>(null);

    const handleOpenResume = (userId: string) => {
        const usersStr = localStorage.getItem("db_users");
        let foundUser = null;

        if (usersStr) {
            const users = JSON.parse(usersStr);
            foundUser = users[userId];
        }

        // Fallback: Try to find in applications
        if (!foundUser) {
            const app = applications.find(a => a.userId === userId);
            if (app) {
                foundUser = {
                    id: app.userId,
                    name: app.applicantName,
                    phone: app.applicantPhone,
                    email: app.applicantEmail,
                    // Minimal stub
                };
            }
        }

        if (foundUser) {
            setSelectedResumeUser(foundUser);
            setShowResumeModal(true);
        } else {
            console.error("User not found for ID:", userId);
            alert("사용자 정보가 완전히 소실되어 복구할 수 없습니다.");
        }
    };

    useEffect(() => {
        // Load applications
        const appsStr = localStorage.getItem("db_applications");
        if (appsStr) {
            setApplications(JSON.parse(appsStr));
        }

        // Load proposals
        const propsStr = localStorage.getItem("db_proposals");
        if (propsStr) {
            setProposals(JSON.parse(propsStr));
        }

        // Load jobs for title mapping
        const jobsStr = localStorage.getItem("db_jobs");
        if (jobsStr) {
            setJobs(JSON.parse(jobsStr));
        }

        // Load users for status sync
        const usersStr = localStorage.getItem("db_users");
        if (usersStr) {
            setUsers(JSON.parse(usersStr));
        }

        // Load companies for contact info
        const companiesStr = localStorage.getItem("db_companies");
        if (companiesStr) {
            setCompanies(JSON.parse(companiesStr));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("role");
        navigate("/login");
    }

    const getJobTitle = (jobId: string | number) => {
        const job = jobs.find((j) => String(j.id) === String(jobId));
        return job ? job.title : "삭제된 공고";
    };

    const handleDelete = (id: string) => {
        if (confirm("정말 이 지원자 기록을 삭제하시겠습니까?")) {
            const updated = applications.filter((app) => app.id !== id);
            setApplications(updated);
            localStorage.setItem("db_applications", JSON.stringify(updated));

            // Remove from selection if it was selected
            if (selectedAppIds.has(id)) {
                const newSet = new Set(selectedAppIds);
                newSet.delete(id);
                setSelectedAppIds(newSet);
            }
        }
    };

    // Bulk Delete Handler
    const handleBulkDelete = () => {
        if (viewMode === "APPLICATIONS") {
            if (selectedAppIds.size === 0) return;
            if (confirm(`선택한 ${selectedAppIds.size}개의 항목을 삭제하시겠습니까?`)) {
                const updated = applications.filter(app => !selectedAppIds.has(app.id));
                setApplications(updated);
                localStorage.setItem("db_applications", JSON.stringify(updated));
                setSelectedAppIds(new Set());
            }
        } else {
            if (selectedPropIds.size === 0) return;
            if (confirm(`선택한 ${selectedPropIds.size}개의 항목을 삭제하시겠습니까?`)) {
                const updated = proposals.filter(prop => !selectedPropIds.has(prop.id));
                setProposals(updated);
                localStorage.setItem("db_proposals", JSON.stringify(updated));
                setSelectedPropIds(new Set());
            }
        }
    };

    // Hired Info Helper
    const getHiredInfo = (userId: string) => {
        // Check Applications
        const app = applications.find(a => a.userId === userId && a.processStatus === "HIRED");
        if (app) {
            const job = jobs.find(j => String(j.id) === String(app.jobId));
            const company = job ? Object.values(companies).find(c => c.companyName === job.company) : null;
            return {
                source: "지원",
                detail: getJobTitle(app.jobId),
                companyName: company ? company.companyName : (job?.company || "기업 미상"),
                manager: company ? company.contactPerson : "담당자 미정",
                phone: company ? (company.contactPhone || "연락처 미입력") : "-"
            };
        }

        // Check Proposals
        const prop = proposals.find(p => p.userId === userId && p.processStatus === "HIRED");
        if (prop) {
            const company = companies[prop.companyId];
            return {
                source: "제안",
                detail: prop.type === "HIRING" ? "채용 제안" : "면접 제안",
                companyName: prop.companyName,
                manager: company ? company.contactPerson : "담당자 미정",
                phone: company ? (company.contactPhone || "연락처 미입력") : "-"
            };
        }

        return { source: "-", detail: "-", companyName: "-", manager: "-", phone: "-" };
    };

    // Selection Handlers
    const toggleSelectAll = (checked: boolean) => {
        if (viewMode === "APPLICATIONS") {
            if (checked) {
                const allIds = new Set(filteredApps.map(app => app.id));
                setSelectedAppIds(allIds);
            } else {
                setSelectedAppIds(new Set());
            }
        } else {
            if (checked) {
                const allIds = new Set(proposals.map(p => p.id));
                setSelectedPropIds(allIds);
            } else {
                setSelectedPropIds(new Set());
            }
        }
    };

    const toggleSelectOne = (id: string) => {
        if (viewMode === "APPLICATIONS") {
            const newSet = new Set(selectedAppIds);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            setSelectedAppIds(newSet);
        } else {
            const newSet = new Set(selectedPropIds);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            setSelectedPropIds(newSet);
        }
    };

    const handleStatusChange = (id: string, newStatus: Application["status"]) => {
        const updated = applications.map((app) =>
            app.id === id ? { ...app, status: newStatus } : app
        );
        setApplications(updated);
        localStorage.setItem("db_applications", JSON.stringify(updated));
    };

    const handleMemoChange = (id: string, newMemo: string) => {
        const updated = applications.map((app) =>
            app.id === id ? { ...app, memo: newMemo } : app
        );
        setApplications(updated);
        localStorage.setItem("db_applications", JSON.stringify(updated));
    }



    const updateGlobalUserStatus = (userId: string, newStatus?: string, newDate?: string) => {
        // 1. Update User DB
        const updatedUsers = { ...users };

        // Self-Healing: If user missing, try to restore from Application/Proposal
        if (!updatedUsers[userId]) {
            const app = applications.find(a => a.userId === userId);
            const prop = proposals.find(p => p.userId === userId);

            if (app || prop) {
                updatedUsers[userId] = {
                    id: userId,
                    name: app?.applicantName || prop?.userName || "알수없음",
                    phone: app?.applicantPhone || "연락처없음",
                    email: app?.applicantEmail || "이메일없음",
                    processStatus: "INTERVIEW_SCHEDULED" // Default or will be overwritten
                };
            }
        }

        if (updatedUsers[userId]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (newStatus !== undefined) {
                updatedUsers[userId] = {
                    ...updatedUsers[userId],
                    processStatus: newStatus as any,
                    // If status changed to HIRED, update timestamp (if not already set or we want to overwrite)
                    ...(newStatus === "HIRED" ? { hiredAt: new Date().toISOString() } : {})
                };
            }
            if (newDate !== undefined) {
                updatedUsers[userId] = {
                    ...updatedUsers[userId],
                    interviewDate: newDate
                };
            }
            setUsers(updatedUsers);
            localStorage.setItem("db_users", JSON.stringify(updatedUsers));
        }

        // 2. Sync all Applications for this User
        const updatedApps = applications.map(app =>
            app.userId === userId ? {
                ...app,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(newStatus !== undefined && { processStatus: newStatus as any }),
                ...(newDate !== undefined && { interviewDate: newDate })
            } : app
        );
        setApplications(updatedApps);
        localStorage.setItem("db_applications", JSON.stringify(updatedApps));

        // 3. Sync all Proposals for this User
        const updatedProps = proposals.map(prop =>
            prop.userId === userId ? {
                ...prop,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(newStatus !== undefined && { processStatus: newStatus as any }),
                ...(newDate !== undefined && { interviewDate: newDate })
            } : prop
        );
        setProposals(updatedProps);
        localStorage.setItem("db_proposals", JSON.stringify(updatedProps));
    };

    const handleProcessStatusChange = (id: string, status: string, type: "APP" | "PROP") => {
        let userId = "";
        if (type === "APP") {
            const app = applications.find(a => a.id === id);
            if (app) userId = app.userId;
        } else {
            const prop = proposals.find(p => p.id === id);
            if (prop) userId = prop.userId;
        }

        if (userId) {
            updateGlobalUserStatus(userId, status, undefined);
        }
    };

    const handleInterviewDateChange = (date: Date | null, id: string, type: "APP" | "PROP") => {
        const formatted = date ? date.toLocaleDateString("ko-KR", { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '/').replace('.', '') : "";

        let userId = "";
        if (type === "APP") {
            const app = applications.find(a => a.id === id);
            if (app) userId = app.userId;
        } else {
            const prop = proposals.find(p => p.id === id);
            if (prop) userId = prop.userId;
        }

        if (userId) {
            updateGlobalUserStatus(userId, undefined, formatted);
        }
    };


    const handleSearch = () => {
        setSearchQuery(searchInput);
    };

    const filteredApps = applications.filter((app) => {
        // Status Filter
        if (statusFilter !== "all" && app.status !== statusFilter) return false;

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const jobTitle = getJobTitle(app.jobId).toLowerCase();
            const companyName = (jobs.find(j => String(j.id) === String(app.jobId))?.company || "").toLowerCase();
            const user = users[app.userId];
            const memberNumber = user?.memberNumber?.toLowerCase() || "";
            return (
                app.applicantName.toLowerCase().includes(query) ||
                jobTitle.includes(query) ||
                companyName.includes(query) ||
                memberNumber.includes(query)
            );
        }
        return true;
    });

    const filteredProposals = proposals.filter((prop) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const company = companies[prop.companyId];
            const companyName = prop.companyName || company?.companyName || "";
            const user = users[prop.userId];
            const memberNumber = user?.memberNumber?.toLowerCase() || "";
            return (
                prop.userName.toLowerCase().includes(query) ||
                companyName.toLowerCase().includes(query) ||
                memberNumber.includes(query)
            );
        }
        return true;
    });

    const filteredHiredUsers = Object.values(users)
        .filter(u => u.processStatus === "HIRED")
        .filter(u => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const info = getHiredInfo(u.id);
                return (
                    u.name.toLowerCase().includes(query) ||
                    info.companyName.toLowerCase().includes(query) ||
                    (u.memberNumber || "").toLowerCase().includes(query)
                );
            }
            return true;
        })
        .sort((a, b) => new Date(b.hiredAt || 0).getTime() - new Date(a.hiredAt || 0).getTime());


    const downloadExcel = () => {
        const headers = ["공고명", "지원자명", "연락처", "이메일", "지원일시", "상태", "메모", "진행상태", "면접일자"];
        const rows = filteredApps.map(app => [
            getJobTitle(app.jobId),
            app.applicantName,
            app.applicantPhone,
            app.applicantEmail,
            new Date(app.appliedAt).toLocaleString(),
            getStatusLabel(app.status),
            app.memo || "",
            getProcessStatusLabel(app.processStatus),
            app.interviewDate || ""
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(item => `"${item}"`).join(","))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `지원자목록_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return '검토중';
            case 'viewed': return '열람';
            case 'accepted': return '합격';
            case 'rejected': return '불합격';
            default: return status;
        }
    }

    const getProcessStatusLabel = (status?: string) => {
        switch (status) {
            case 'INTERVIEW_SCHEDULED': return '면접예정';
            case 'INTERVIEW_COMPLETED': return '면접완료';
            case 'HIRED': return '채용완료';
            default: return '미정';
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'viewed': return 'bg-blue-100 text-blue-700';
            case 'accepted': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    // --- Member Management Logic ---

    // Combined Member List Memoization
    const allMembers = [
        ...Object.values(users).map(u => ({ ...u, type: '개인' })),
        ...Object.values(companies).map(c => ({ ...c, type: '기업', name: c.companyName, phone: c.contactPerson + ' (' + c.contactPhone + ')', email: '-' }))
    ].filter(member => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const m = member as any;
        return (
            (m.name || "").toLowerCase().includes(query) ||
            (m.id || "").toLowerCase().includes(query) ||
            (m.memberNumber || "").toLowerCase().includes(query)
        );
    });

    const handleDeleteMember = (id: string, type: string) => {
        if (confirm(`정말 이 ${type} 회원을 삭제하시겠습니까? (ID: ${id})`)) {
            if (type === '개인') {
                const newUsers = { ...users };
                delete newUsers[id];
                setUsers(newUsers);
                localStorage.setItem("db_users", JSON.stringify(newUsers));
            } else {
                const newCompanies = { ...companies };
                delete newCompanies[id];
                setCompanies(newCompanies);
                localStorage.setItem("db_companies", JSON.stringify(newCompanies));
            }
            alert("회원이 삭제되었습니다.");
        }
    };

    const downloadMembersExcel = () => {
        const headers = ["유형", "회원번호", "아이디", "이름/기업명", "연락처", "이메일"];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows = allMembers.map((member: any) => [
            member.type,
            member.memberNumber || "-",
            member.id,
            member.name,
            member.phone,
            member.email || "-"
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(item => `"${item}"`).join(","))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `전체회원명부_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Admin Header */}
            {/* Admin Header */}
            <header className="bg-gray-900 text-white h-[70px] px-6 shadow-md flex justify-center">
                <div className="w-full max-w-7xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xl font-black italic tracking-tighter">
                        <FiSettings className="text-blue-500" /> JOB-ALBA ADMIN
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/admin/notices")}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <FiFileText /> 공지사항 관리
                        </button>
                        <button
                            onClick={() => navigate("/admin/edit")}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <FiSettings /> 정보수정
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <FiLogOut /> 로그아웃
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 mb-6 gap-4">
                    <div className="flex">
                        <button
                            onClick={() => setViewMode("APPLICATIONS")}
                            className={`pb-4 pl-0 pr-4 text-lg font-bold transition-all border-b-2 ${viewMode === "APPLICATIONS"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            지원자 관리 <span className="ml-2 py-0.5 px-2 bg-gray-100 rounded-full text-sm text-gray-600">{applications.length}</span>
                        </button>
                        <button
                            onClick={() => setViewMode("PROPOSALS")}
                            className={`pb-4 px-4 text-lg font-bold transition-all border-b-2 ${viewMode === "PROPOSALS"
                                ? "border-gray-800 text-gray-900"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            채용/면접 제안 관리 <span className="ml-2 py-0.5 px-2 bg-gray-100 rounded-full text-sm text-gray-600">{proposals.length}</span>
                        </button>
                        <button
                            onClick={() => setViewMode("HIRED")}
                            className={`pb-4 px-4 text-lg font-bold transition-all border-b-2 ${viewMode === "HIRED"
                                ? "border-green-600 text-green-600"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            채용 완료 목록 <span className="ml-2 py-0.5 px-2 bg-gray-100 rounded-full text-sm text-gray-600">{Object.values(users).filter(u => u.processStatus === "HIRED").length}</span>
                        </button>
                        <button
                            onClick={() => setViewMode("MEMBERS")}
                            className={`pb-4 px-4 text-lg font-bold transition-all border-b-2 ${viewMode === "MEMBERS"
                                ? "border-purple-600 text-purple-600"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            전체 등록 회원 명부 <span className="ml-2 py-0.5 px-2 bg-gray-100 rounded-full text-sm text-gray-600">{allMembers.length}</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <div className="relative flex items-center gap-2">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="구직자 또는 기업명 검색"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64 shadow-sm"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors"
                            >
                                검색
                            </button>
                        </div>
                    </div>
                </div>

                {viewMode === "MEMBERS" && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                        <div className="px-6 py-4 border-b border-gray-100 bg-purple-50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-purple-800">전체 등록 회원 명부</h3>
                                <span className="text-xs text-purple-600">개인 및 기업 회원의 통합 관리 리스트입니다.</span>
                            </div>
                            <button
                                onClick={downloadMembersExcel}
                                className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-purple-200 transition-colors"
                            >
                                <FiDownload /> 엑셀 다운로드
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100 text-xs text-gray-500 uppercase font-bold whitespace-nowrap">
                                        <th className="px-6 py-4">유형</th>
                                        <th className="px-6 py-4">회원번호</th>
                                        <th className="px-6 py-4">아이디</th>
                                        <th className="px-6 py-4">이름 / 기업명</th>
                                        <th className="px-6 py-4">연락처 / 대표전화</th>
                                        <th className="px-6 py-4">이메일</th>
                                        <th className="px-6 py-4 text-center">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {/* Combined List Rendering */}
                                    {allMembers.map((member: any) => (
                                        <tr key={member.id} className="hover:bg-purple-50/30 transition-colors whitespace-nowrap">
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${member.type === '개인' ? 'bg-blue-100 text-blue-700' : 'bg-gray-800 text-white'}`}>
                                                    {member.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono text-gray-500">
                                                {member.memberNumber || "-"}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                {member.id}
                                            </td>
                                            <td className="px-6 py-4 text-gray-800">
                                                {member.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {member.phone}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {member.email}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDeleteMember(member.id, member.type)}
                                                    className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                    title="회원 삭제"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="px-6 py-4 border-b border-gray-100 bg-green-50 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-green-800">채용 완료된 인재 목록</h3>
                            <span className="text-xs text-green-600">최종 채용이 확정된 구직자 리스트입니다.</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-100 text-xs text-gray-500 uppercase font-bold whitespace-nowrap">
                                    <th className="px-6 py-4">구직자 정보</th>
                                    <th className="px-6 py-4">회원번호</th>
                                    <th className="px-6 py-4">구직자 연락처</th>
                                    <th className="px-6 py-4">채용 구분</th>
                                    <th className="px-6 py-4">채용 기업</th>
                                    <th className="px-6 py-4">기업 담당자</th>
                                    <th className="px-6 py-4">기업 연락처</th>
                                    <th className="px-6 py-4">상태</th>
                                    <th className="px-6 py-4 text-center">작업</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredHiredUsers.length > 0 ? (
                                    filteredHiredUsers
                                        .map((user) => {
                                            const hiredInfo = getHiredInfo(user.id);
                                            return (
                                                <tr key={user.id} className="hover:bg-green-50/30 transition-colors whitespace-nowrap">
                                                    <td className="px-6 py-4 font-bold text-gray-900">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                                        {user.memberNumber || "-"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-gray-800 text-sm">{user.phone}</div>
                                                        <div className="text-gray-400 text-xs">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${hiredInfo.source === "지원" ? "bg-blue-100 text-blue-700" : hiredInfo.source === "제안" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}>
                                                            {hiredInfo.source}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-800">{hiredInfo.companyName}</div>
                                                        <div className="text-xs text-gray-500">{hiredInfo.detail !== hiredInfo.companyName ? hiredInfo.detail : ""}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {hiredInfo.manager}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {hiredInfo.phone}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                                                            채용완료
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleOpenResume(user.id)}
                                                            className="text-xs flex items-center justify-center gap-1 text-blue-600 hover:underline mx-auto mb-2"
                                                        >
                                                            <FiFileText /> 이력서 보기
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm("채용 상태를 취소하시겠습니까? 목록에서 제거됩니다.")) {
                                                                    // Revert to INTERVIEW_COMPLETED or simply remove the status
                                                                    updateGlobalUserStatus(user.id, "INTERVIEW_COMPLETED");
                                                                }
                                                            }}
                                                            className="text-xs flex items-center justify-center gap-1 text-red-500 hover:bg-red-50 px-2 py-1 rounded mx-auto transition-colors"
                                                        >
                                                            <FiTrash2 /> 채용 취소
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-20 text-center text-gray-400">
                                            아직 채용 완료된 구직자가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {viewMode === "APPLICATIONS" ? (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="relative w-full md:w-64">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="이름 또는 공고명 검색"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">전체 상태</option>
                                    <option value="pending">검토중</option>
                                    <option value="viewed">열람</option>
                                    <option value="accepted">합격</option>
                                    <option value="rejected">불합격</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedAppIds.size > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition font-bold text-sm animate-fade-in"
                                    >
                                        <FiTrash2 /> 선택 삭제 ({selectedAppIds.size})
                                    </button>
                                )}
                                <button
                                    onClick={downloadExcel}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold text-sm"
                                >
                                    <FiDownload /> 엑셀 다운로드
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-bold whitespace-nowrap">
                                            <th className="px-6 py-4 w-12 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                                                    onChange={(e) => toggleSelectAll(e.target.checked)}
                                                    checked={filteredApps.length > 0 && selectedAppIds.size === filteredApps.length}
                                                />
                                            </th>
                                            <th className="px-6 py-4">지원일 / 공고명</th>
                                            <th className="px-6 py-4">지원자 정보</th>
                                            <th className="px-6 py-4">연락처</th>
                                            <th className="px-6 py-4">상태 관리</th>
                                            <th className="px-6 py-4">관리자 메모</th>
                                            <th className="px-6 py-4">중개 관리</th>
                                            <th className="px-6 py-4 text-center">작업</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredApps.length > 0 ? (
                                            filteredApps.map((app) => (
                                                <tr key={app.id} className={`hover:bg-blue-50/30 transition-colors group whitespace-nowrap ${selectedAppIds.has(app.id) ? 'bg-blue-50/50' : ''}`}>
                                                    <td className="px-6 py-4 text-center">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                                                            checked={selectedAppIds.has(app.id)}
                                                            onChange={() => toggleSelectOne(app.id)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-xs text-gray-400 mb-1">
                                                            {new Date(app.appliedAt).toLocaleDateString()}
                                                        </div>
                                                        <div className="font-bold text-gray-800">
                                                            {getJobTitle(app.jobId)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                                <FiUser />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-gray-900">{app.applicantName}</div>
                                                                <div className="text-xs text-gray-500">개인회원</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <FiPhone className="text-gray-400 text-xs" /> {app.applicantPhone}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FiMail className="text-gray-400 text-xs" /> {app.applicantEmail}
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleOpenResume(app.userId); }}
                                                            className="mt-2 text-xs flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors w-full cursor-pointer"
                                                        >
                                                            <FiFileText /> 이력서 보기
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={app.status}
                                                            onChange={(e) => handleStatusChange(app.id, e.target.value as Application["status"])}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-0 cursor-pointer focus:ring-2 ring-offset-1 focus:ring-blue-400 ${getStatusColor(app.status)}`}
                                                        >
                                                            <option value="pending">검토중</option>
                                                            <option value="viewed">열람</option>
                                                            <option value="accepted">합격</option>
                                                            <option value="rejected">불합격</option>
                                                        </select>
                                                        {users[app.userId]?.processStatus && (
                                                            <div className="mt-2 text-xs font-bold text-gray-500">
                                                                취업현황: <span className="text-blue-600">{getProcessStatusLabel(users[app.userId].processStatus)}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-blue-300 transition-colors"
                                                                placeholder="메모 입력..."
                                                                value={app.memo || ""}
                                                                onChange={(e) => handleMemoChange(app.id, e.target.value)}
                                                            />
                                                            <FiEdit2 className="text-gray-300 hover:text-blue-500 cursor-pointer" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    className="px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                                                                    value={users[app.userId]?.processStatus || app.processStatus || ""}
                                                                    onChange={(e) => handleProcessStatusChange(app.id, e.target.value, "APP")}
                                                                >
                                                                    <option value="">상태 선택</option>
                                                                    <option value="INTERVIEW_SCHEDULED">면접예정</option>
                                                                    <option value="INTERVIEW_COMPLETED">면접완료</option>
                                                                    <option value="HIRED">채용완료</option>
                                                                </select>
                                                                {app.processStatus === "INTERVIEW_SCHEDULED" && (
                                                                    <div className="w-28 relative">
                                                                        <DatePicker
                                                                            selected={app.interviewDate ? new Date(app.interviewDate.replace(/\//g, '-')) : null}
                                                                            onChange={(date: Date | null) => handleInterviewDateChange(date, app.id, "APP")}
                                                                            dateFormat="yyyy/MM/dd"
                                                                            className="px-2 py-1 border border-gray-200 rounded text-xs w-full text-center cursor-pointer z-50"
                                                                            placeholderText="YYYY/MM/DD"
                                                                            popperPlacement="bottom-start"
                                                                            portalId="root-portal"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleDelete(app.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            title="삭제"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                                    데이터가 없습니다.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-gray-700">채용 및 면접 제안 요청 목록</h3>
                                <span className="text-xs text-gray-400">기업이 구직자에게 보낸 제안을 중개합니다.</span>
                            </div>
                            {selectedPropIds.size > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-bold text-xs animate-fade-in"
                                >
                                    <FiTrash2 /> 선택 삭제 ({selectedPropIds.size})
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100 text-xs text-gray-500 uppercase font-bold whitespace-nowrap">
                                        <th className="px-6 py-4 w-12 text-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                                                onChange={(e) => toggleSelectAll(e.target.checked)}
                                                checked={filteredProposals.length > 0 && selectedPropIds.size === filteredProposals.length}
                                            />
                                        </th>
                                        <th className="px-6 py-4">요청일시</th>
                                        <th className="px-6 py-4">유형</th>
                                        <th className="px-6 py-4">요청 기업</th>
                                        <th className="px-6 py-4">기업 담당자</th>
                                        <th className="px-6 py-4">대상 구직자</th>
                                        <th className="px-6 py-4">진행 상태</th>
                                        <th className="px-6 py-4">중개 관리</th>
                                        <th className="px-6 py-4 text-center">작업</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredProposals.length > 0 ? (
                                        filteredProposals.map((prop) => (
                                            <tr key={prop.id} className={`hover:bg-blue-50/30 transition-colors whitespace-nowrap ${selectedPropIds.has(prop.id) ? 'bg-blue-50/50' : ''}`}>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                                                        checked={selectedPropIds.has(prop.id)}
                                                        onChange={() => toggleSelectOne(prop.id)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(prop.createdAt).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${prop.type === "HIRING" ? "bg-purple-100 text-purple-700" : "bg-teal-100 text-teal-700"
                                                        }`}>
                                                        {prop.type === "HIRING" ? "채용 제안" : "면접 제안"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-800">
                                                    {prop.companyName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-gray-800">
                                                        {companies[prop.companyId]?.contactPerson || "담당자 미정"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {companies[prop.companyId]?.contactPosition || "직책 미입력"} | {companies[prop.companyId]?.contactPhone || "연락처 미입력"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {prop.userName}
                                                    <span className="text-xs text-gray-400 ml-1">({prop.userId})</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">
                                                        대기중 (관리자 확인)
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                className="px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                                                                value={users[prop.userId]?.processStatus || prop.processStatus || ""}
                                                                onChange={(e) => handleProcessStatusChange(prop.id, e.target.value, "PROP")}
                                                            >
                                                                <option value="">상태 선택</option>
                                                                <option value="INTERVIEW_SCHEDULED">면접예정</option>
                                                                <option value="INTERVIEW_COMPLETED">면접완료</option>
                                                                <option value="HIRED">채용완료</option>
                                                            </select>
                                                            {prop.processStatus === "INTERVIEW_SCHEDULED" && (
                                                                <div className="w-28 relative">
                                                                    <DatePicker
                                                                        selected={prop.interviewDate ? new Date(prop.interviewDate.replace(/\//g, '-')) : null}
                                                                        onChange={(date: Date | null) => handleInterviewDateChange(date, prop.id, "PROP")}
                                                                        dateFormat="yyyy/MM/dd"
                                                                        className="px-2 py-1 border border-gray-200 rounded text-xs w-full text-center cursor-pointer z-50"
                                                                        placeholderText="YYYY/MM/DD"
                                                                        popperPlacement="bottom-start"
                                                                        portalId="root-portal"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => {
                                                            if (confirm("정말 이 제안을 삭제하시겠습니까? (복구 불가)")) {
                                                                const updated = proposals.filter(p => p.id !== prop.id);
                                                                setProposals(updated);
                                                                localStorage.setItem("db_proposals", JSON.stringify(updated));

                                                                if (selectedPropIds.has(prop.id)) {
                                                                    const newSet = new Set(selectedPropIds);
                                                                    newSet.delete(prop.id);
                                                                    setSelectedPropIds(newSet);
                                                                }
                                                            }
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="단일 삭제"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-20 text-center text-gray-400">
                                                요청된 제안 내역이 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Resume Modal */}
            {showResumeModal && selectedResumeUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
                        <button
                            onClick={() => setShowResumeModal(false)}
                            className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 text-xl rounded-full hover:bg-black/70 transition-colors"
                        >
                            <FiX />
                        </button>
                        <ResumeView user={selectedResumeUser} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
