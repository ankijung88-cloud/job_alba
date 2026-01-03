import { useState, useEffect } from "react";
import { FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface Notice {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

export default function AdminNoticeManage() {
    const navigate = useNavigate();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNotice, setCurrentNotice] = useState<Notice | null>(null);

    // Load notices
    useEffect(() => {
        const data = localStorage.getItem("db_notices");
        if (data) {
            setNotices(JSON.parse(data));
        }
    }, []);

    const saveToStorage = (newNotices: Notice[]) => {
        localStorage.setItem("db_notices", JSON.stringify(newNotices));
        setNotices(newNotices);
    };

    const handleCreate = () => {
        setCurrentNotice({
            id: Date.now().toString(),
            title: "",
            content: "",
            createdAt: new Date().toISOString(),
        });
        setIsEditing(true);
    };

    const handleEdit = (notice: Notice) => {
        setCurrentNotice({ ...notice });
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
            const updated = notices.filter(n => n.id !== id);
            saveToStorage(updated);
        }
    };

    const handleSave = () => {
        if (!currentNotice || !currentNotice.title.trim() || !currentNotice.content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        let updatedNotices = [...notices];
        const index = updatedNotices.findIndex(n => n.id === currentNotice.id);

        if (index >= 0) {
            // Update
            updatedNotices[index] = { ...currentNotice, updatedAt: new Date().toISOString() };
        } else {
            // Create
            updatedNotices = [currentNotice, ...updatedNotices];
        }

        saveToStorage(updatedNotices);
        setIsEditing(false);
        setCurrentNotice(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/admin/dashboard")} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <FiArrowLeft className="text-xl" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">공지사항 관리</h1>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FiPlus /> 공지사항 작성
                        </button>
                    )}
                </div>

                {isEditing && currentNotice ? (
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 animate-fade-in-up">
                        <h2 className="text-xl font-bold mb-6 border-b pb-4">
                            {notices.find(n => n.id === currentNotice.id) ? "공지사항 수정" : "새 공지사항 작성"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">제목</label>
                                <input
                                    type="text"
                                    value={currentNotice.title}
                                    onChange={e => setCurrentNotice({ ...currentNotice, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="공지사항 제목을 입력하세요"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">내용</label>
                                <textarea
                                    value={currentNotice.content}
                                    onChange={e => setCurrentNotice({ ...currentNotice, content: e.target.value })}
                                    className="w-full h-96 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    placeholder="공지사항 내용을 입력하세요"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <FiX /> 취소
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                                >
                                    <FiSave /> 저장하기
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-500">제목</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-500 w-48">작성일</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-500 w-32 text-center">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {notices.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                                            등록된 공지사항이 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    notices.map(notice => (
                                        <tr key={notice.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {notice.title}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(notice.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(notice)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="수정"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(notice.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="삭제"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
