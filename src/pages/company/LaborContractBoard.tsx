import { useState, useEffect } from "react";
import { FiFileText, FiDownload, FiUpload, FiSearch } from "react-icons/fi";

interface ContractFile {
    id: number;
    title: string;
    fileName: string;
    size: string;
    date: string;
    author: string;
    downloads: number;
}

const INITIAL_FILES: ContractFile[] = [
    {
        id: 1,
        title: "2025년 표준 근로계약서 양식 (전체)",
        fileName: "standard_contract_2025.docx",
        size: "45KB",
        date: "2025.12.01",
        author: "관리자",
        downloads: 1250,
    },
    {
        id: 2,
        title: "단시간 근로자(아르바이트) 표준 계약서",
        fileName: "part_time_contract.docx",
        size: "32KB",
        date: "2025.12.05",
        author: "관리자",
        downloads: 890,
    },
    {
        id: 3,
        title: "연소자(18세 미만) 근로계약서 및 동의서",
        fileName: "young_worker_contract.zip",
        size: "1.2MB",
        date: "2025.12.10",
        author: "법무팀",
        downloads: 450,
    },
    {
        id: 4,
        title: "외국인 근로자 표준 근로계약서 (영문병기)",
        fileName: "foreigner_contract_eng.pdf",
        size: "520KB",
        date: "2025.12.15",
        author: "관리자",
        downloads: 620,
    },
    {
        id: 5,
        title: "수습기간 적용 동의서 양식",
        fileName: "probation_agreement.hwp",
        size: "18KB",
        date: "2025.12.20",
        author: "인사팀",
        downloads: 310,
    },
];

export default function LaborContractBoard() {
    const [files, setFiles] = useState<ContractFile[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // 로컬 스토리지에서 데이터 로드 (없으면 초기 데이터 사용)
        const stored = localStorage.getItem("db_contract_files");
        if (stored) {
            setFiles(JSON.parse(stored));
        } else {
            setFiles(INITIAL_FILES);
            localStorage.setItem("db_contract_files", JSON.stringify(INITIAL_FILES));
        }
    }, []);

    const handleDownload = (file: ContractFile) => {
        // 다운로드 시뮬레이션
        alert(`'${file.fileName}' 파일을 다운로드합니다.\n(실제 파일 서버가 연결되지 않았습니다.)`);

        // 다운로드 수 증가 업데이트
        const updatedFiles = files.map(f =>
            f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f
        );
        setFiles(updatedFiles);
        localStorage.setItem("db_contract_files", JSON.stringify(updatedFiles));
    };

    const handleUpload = () => {
        // 업로드 시뮬레이션
        const title = prompt("자료 제목을 입력하세요:");
        if (!title) return;

        const newFile: ContractFile = {
            id: Date.now(),
            title,
            fileName: "uploaded_file.docx", // 임시 파일명
            size: "10KB",
            date: new Date().toISOString().split("T")[0].replace(/-/g, "."),
            author: "기업회원",
            downloads: 0
        };

        const updatedFiles = [newFile, ...files];
        setFiles(updatedFiles);
        localStorage.setItem("db_contract_files", JSON.stringify(updatedFiles));
        alert("자료가 등록되었습니다.");
    };

    const filteredFiles = files.filter(f =>
        f.title.includes(searchTerm) || f.fileName.includes(searchTerm)
    );

    return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Top Bar */}
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="자료명 또는 파일명 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <button
                    onClick={handleUpload}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-all shadow-md"
                >
                    <FiUpload /> 자료 등록
                </button>
            </div>

            {/* File List */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-gray-100 text-xs text-gray-500 uppercase">
                            <th className="px-6 py-4 font-bold w-16 text-center">No.</th>
                            <th className="px-6 py-4 font-bold">자료 제목</th>
                            <th className="px-6 py-4 font-bold w-32">등록일</th>
                            <th className="px-6 py-4 font-bold w-24">작성자</th>
                            <th className="px-6 py-4 font-bold w-24 text-center">크기</th>
                            <th className="px-6 py-4 font-bold w-24 text-center">다운로드</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredFiles.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            filteredFiles.map((file, index) => (
                                <tr key={file.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-center text-gray-400 text-sm">
                                        {files.length - index}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <FiFileText size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleDownload(file)}>
                                                    {file.title}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{file.fileName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {file.date}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {file.author}
                                    </td>
                                    <td className="px-6 py-4 text-center text-xs text-gray-400 bg-gray-50/50 rounded-lg">
                                        {file.size}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDownload(file)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all"
                                            title={`${file.downloads}회 다운로드됨`}
                                        >
                                            <FiDownload size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
