
import { FiUser, FiPhone, FiMail, FiMapPin, FiAward, FiCheckCircle, FiBriefcase } from "react-icons/fi";

interface ResumeProps {
    user: any; // UserAccount
    isRestricted?: boolean; // If true, hide contact info and truncate address
}

export default function ResumeView({ user, isRestricted = false }: ResumeProps) {
    if (!user) return <div>사용자 정보가 없습니다.</div>;

    return (
        <div className="bg-white max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden print:shadow-none print:w-full">
            {/* Header / Profile Section */}
            <div className="bg-gray-900 text-white p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="shrink-0 relative">
                    {user.profilePhoto ? (
                        <img
                            src={user.profilePhoto}
                            alt="Profile"
                            className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg"
                        />
                    ) : (
                        <div className="w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center text-4xl border-4 border-gray-600">
                            <FiUser />
                        </div>
                    )}
                    {user.nationality === "FOREIGNER" && (
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-gray-900">
                            VISA: {user.visaType}
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                            {user.name}
                            <span className="text-lg font-normal text-gray-400 ml-2">
                                ({user.nationality === "FOREIGNER" ? "외국인" : "내국인"})
                            </span>
                        </h1>
                        <p className="text-blue-400 font-medium text-lg">{user.intro || "안녕하세요, 열정적인 인재입니다."}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <FiPhone /> {isRestricted ? "비공개 (채용 제안 시 공개)" : user.phone}
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <FiMail /> {isRestricted ? "비공개 (채용 제안 시 공개)" : (user.email || "이메일 정보 없음")}
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <FiMapPin /> {isRestricted && user.address ? user.address.split(" ").slice(0, 2).join(" ") : (user.address || "주소지 정보 미등록")}
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <FiCheckCircle className="text-green-500" /> 신원 인증 완료
                        </div>
                    </div>
                </div>
            </div>

            {/* Body Content */}
            <div className="p-8 md:p-12 space-y-10">

                {/* 1. 자기소개 */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                        <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                        자기소개
                    </h2>
                    <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 leading-relaxed whitespace-pre-line">
                        {user.selfIntro || "등록된 자기소개가 없습니다."}
                    </div>
                </section>

                {/* 2. 학력 및 경력 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiAward className="text-blue-600" /> 학력 사항
                        </h2>
                        {user.education ? (
                            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                <div className="text-lg font-bold text-gray-800">{user.education.schoolName || "학교명 미입력"}</div>
                                <div className="text-gray-500">{user.education.level} {user.education.graduated ? "졸업" : "재학/중퇴"}</div>
                            </div>
                        ) : (
                            <p className="text-gray-400">학력 정보가 없습니다.</p>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiBriefcase className="text-blue-600" /> 경력 사항
                        </h2>
                        {user.experiences && user.experiences.length > 0 ? (
                            <div className="space-y-3">
                                {user.experiences.map((exp: any, idx: number) => (
                                    <div key={idx} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                        <div className="text-lg font-bold text-gray-800">{exp.companyName}</div>
                                        <div className="text-blue-600 font-medium text-sm mb-1">{exp.position}</div>
                                        <div className="text-gray-500 text-sm">{exp.duration} 근무</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-5 text-gray-500 text-center text-sm">
                                신입 (경력 없음)
                            </div>
                        )}
                    </section>
                </div>

                {/* 3. 외국인 등록증 (관리자에게만 노출, 기업에게도 제한될 수 있음 - 여기선 isRestricted가 true면 숨김) */}
                {user.nationality === "FOREIGNER" && user.visaPhoto && !isRestricted && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                            <span className="w-2 h-8 bg-green-600 rounded-full"></span>
                            외국인 등록증 사본
                        </h2>
                        <div className="bg-gray-100 rounded-2xl p-4 flex justify-center">
                            <img src={user.visaPhoto} alt="Alien Registration Card" className="max-h-64 rounded-xl shadow-md" />
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-2">* 이 정보는 관리자 및 채용 담당자에게만 공개됩니다.</p>
                    </section>
                )}

            </div>
        </div>
    );
}
