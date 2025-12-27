import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiUpload,
  FiEye,
  FiCheckCircle,
} from "react-icons/fi";
import Navigation from "./CompanyNavigation"; // 기업용 네비게이션

// 1. 폼 데이터의 구체적인 타입 정의
interface JobPostData {
  title: string;
  companyName: string;
  category: string;
  jobType: string;
  location: string;
  experience: string;
  education: string;
  salaryType: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  benefits: string;
  contactEmail: string;
  contactPhone: string;
  deadlineType: "date" | "always"; // 고정된 값 설정
  deadlineDate: string;
  autoClose: boolean;
  keywords: string[];
  attachments: File[]; // 혹은 필요한 파일 객체 타입
}

const NewJobPostPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 현재 폼 단계
  const [formData, setFormData] = useState<JobPostData>({
    title: "",
    companyName: "테크컴퍼니",
    category: "",
    jobType: "",
    location: "",
    experience: "",
    education: "",
    salaryType: "월급",
    salaryMin: "",
    salaryMax: "",
    description: "",
    responsibilities: "",
    qualifications: "",
    benefits: "",
    contactEmail: "",
    contactPhone: "",
    deadlineType: "date",
    deadlineDate: "",
    autoClose: false,
    keywords: [],
    attachments: [],
  });
  const [newKeyword, setNewKeyword] = useState("");

  // 3. 입력값 핸들러에서도 타입을 안전하게 처리
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (trimmed && !formData.keywords.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, trimmed],
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keywordToRemove),
    }));
  };

  const handleNextStep = () => {
    // 각 단계별 유효성 검사 추가 필요
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 최종 제출 로직 (API 호출 등)
    console.log("Form Data:", formData);
    alert("채용 공고가 성공적으로 등록되었습니다!");
    navigate("/company/category/공고관리/진행중인 공고"); // 등록 후 이동
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-all"
          >
            <FiArrowLeft /> 뒤로가기
          </button>
          <h1 className="text-3xl font-black text-gray-900">
            새 채용 공고 등록
          </h1>
          <div className="w-20"></div> {/* Space Placeholder */}
        </div>

        {/* 단계 표시기 */}
        <div className="flex justify-center items-center gap-2 mb-10">
          {["기본 정보", "상세 내용", "채용 조건", "마감 설정"].map(
            (stepName, index) => (
              <div key={stepName} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep > index + 1
                      ? "bg-blue-600 text-white"
                      : currentStep === index + 1
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > index + 1 ? <FiCheckCircle /> : index + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep >= index + 1 ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {stepName}
                </span>
                {index < 3 && (
                  <div
                    className={`h-0.5 w-16 mx-2 ${
                      currentStep > index + 1 ? "bg-blue-300" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            )
          )}
        </div>

        {/* 폼 및 미리보기 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 등록 폼 */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: 기본 정보 */}
              {currentStep === 1 && (
                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    1. 기본 정보
                  </h2>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      공고 제목
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="예: [신입] 백엔드 개발자 채용 (Python/Django)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      직무 카테고리
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">선택</option>
                      <option value="IT/개발">IT/개발</option>
                      <option value="디자인">디자인</option>
                      <option value="마케팅">마케팅</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="jobType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      고용 형태
                    </label>
                    <select
                      id="jobType"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">선택</option>
                      <option value="정규직">정규직</option>
                      <option value="계약직">계약직</option>
                      <option value="인턴">인턴</option>
                      <option value="프리랜서">프리랜서</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      근무 지역
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="예: 서울시 강남구"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </section>
              )}

              {/* Step 2: 상세 내용 */}
              {currentStep === 2 && (
                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    2. 상세 내용
                  </h2>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      공고 설명
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      placeholder="지원자들이 흥미를 느낄만한 공고의 특징을 자세히 설명해주세요."
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="responsibilities"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      주요 업무
                    </label>
                    <textarea
                      id="responsibilities"
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleChange}
                      rows={4}
                      placeholder="예: - 서비스 신규 기능 개발 및 유지보수&#10;- 대용량 트래픽 처리 및 성능 개선"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="qualifications"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      자격 요건
                    </label>
                    <textarea
                      id="qualifications"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      rows={4}
                      placeholder="예: - 개발 경력 3년 이상&#10;- React, TypeScript 경험 필수"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="benefits"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      우대 사항 및 혜택
                    </label>
                    <textarea
                      id="benefits"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      rows={4}
                      placeholder="예: - 풀타임 원격 근무 가능&#10;- 주 5일 유연 근무"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                    ></textarea>
                  </div>
                </section>
              )}

              {/* Step 3: 채용 조건 */}
              {currentStep === 3 && (
                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    3. 채용 조건
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        경력
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">선택</option>
                        <option value="경력 무관">경력 무관</option>
                        <option value="신입">신입</option>
                        <option value="1~3년">1~3년</option>
                        <option value="3~5년">3~5년</option>
                        <option value="5년 이상">5년 이상</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="education"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        학력
                      </label>
                      <select
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">선택</option>
                        <option value="학력 무관">학력 무관</option>
                        <option value="고졸 이상">고졸 이상</option>
                        <option value="대졸 이상">대졸 이상</option>
                        <option value="석사 이상">석사 이상</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      급여
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        name="salaryType"
                        value={formData.salaryType}
                        onChange={handleChange}
                        className="w-32 px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="월급">월급</option>
                        <option value="연봉">연봉</option>
                        <option value="시급">시급</option>
                        <option value="면접 후 결정">면접 후 결정</option>
                      </select>
                      {formData.salaryType !== "면접 후 결정" && (
                        <>
                          <input
                            type="number"
                            name="salaryMin"
                            value={formData.salaryMin}
                            onChange={handleChange}
                            placeholder="최소"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                          <span>~</span>
                          <input
                            type="number"
                            name="salaryMax"
                            value={formData.salaryMax}
                            onChange={handleChange}
                            placeholder="최대"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                          <span className="text-gray-500 font-medium">
                            만원
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      검색 키워드
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="ml-1 text-blue-600 hover:text-blue-900"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddKeyword();
                          }
                        }}
                        placeholder="예: 리액트, 퍼블리싱 (Enter로 추가)"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                      >
                        추가
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Step 4: 마감 설정 */}
              {currentStep === 4 && (
                <section className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    4. 마감 설정
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      채용 마감일
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="deadlineType"
                          value="date"
                          checked={formData.deadlineType === "date"}
                          onChange={handleChange}
                          className="form-radio text-blue-600"
                        />
                        날짜 지정
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="deadlineType"
                          value="always"
                          checked={formData.deadlineType === "always"}
                          onChange={handleChange}
                          className="form-radio text-blue-600"
                        />
                        상시 채용
                      </label>
                    </div>
                    {formData.deadlineType === "date" && (
                      <input
                        type="date"
                        name="deadlineDate"
                        value={formData.deadlineDate}
                        onChange={handleChange}
                        className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required={formData.deadlineType === "date"}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <input
                      type="checkbox"
                      id="autoClose"
                      name="autoClose"
                      checked={formData.autoClose}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <label
                      htmlFor="autoClose"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      마감 3일 전 자동 알림 발송 (지원자 대상)
                    </label>
                  </div>
                  <div>
                    <label
                      htmlFor="attachments"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      첨부 파일
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              클릭하거나 드래그
                            </span>
                            하여 파일 업로드
                          </p>
                          <p className="text-xs text-gray-400">
                            PDF, DOCX, JPG (최대 10MB)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          multiple
                          onChange={(e) => console.log(e.target.files)}
                        />
                      </label>
                    </div>
                    {formData.attachments.length > 0 && (
                      <div className="mt-4 text-sm text-gray-600">
                        업로드된 파일:{" "}
                        {formData.attachments
                          .map((file: File) => file.name)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </form>

            {/* 하단 네비게이션 버튼 */}
            <div className="flex justify-between mt-10 border-t pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  <FiArrowLeft /> 이전
                </button>
              )}
              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all ml-auto"
                >
                  다음 단계 <FiArrowLeft className="rotate-180" />
                </button>
              )}
              {currentStep === 4 && (
                <button
                  type="submit"
                  onClick={handleSubmit} // form onSubmit 대신 버튼 onClick에 연결
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all ml-auto"
                >
                  <FiSave /> 공고 등록 완료
                </button>
              )}
            </div>
          </div>

          {/* 오른쪽: 공고 미리보기 (선택 사항) */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiEye /> 공고 미리보기
            </h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner">
              <div className="p-4 bg-blue-50 text-blue-700 font-bold text-center">
                (실제 사용자 화면)
              </div>
              <div className="p-5 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {formData.title || "등록될 공고 제목"}
                </h3>
                <p className="text-sm text-gray-600">{formData.companyName}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>직무: {formData.category || "미정"}</p>
                  <p>근무지: {formData.location || "미정"}</p>
                  <p>고용형태: {formData.jobType || "미정"}</p>
                </div>
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.keywords.map((k, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-4 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {formData.description ||
                    "공고 내용이 여기에 미리 표시됩니다."}
                </p>
                {/* 더 많은 미리보기 내용 추가 가능 */}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              * 최종 등록 후 실제 노출 화면과 다를 수 있습니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewJobPostPage;
