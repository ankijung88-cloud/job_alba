import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiShare2,
  FiHeart,
} from "react-icons/fi";
import Navigation from "../user/Navigation";
import { JOBS_BY_CATEGORY } from "../../constants/categoryJobs";

import type { Job } from "../../types/job";

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // 1. Static Data
  const staticJobs = Object.values(JOBS_BY_CATEGORY).flat() as unknown as Job[];

  // 2. Dynamic Data from LocalStorage
  const storedJobsStr = localStorage.getItem("db_jobs");
  const storedJobs: Job[] = storedJobsStr ? JSON.parse(storedJobsStr) : [];

  // 3. Merge
  const allJobs = [...storedJobs, ...staticJobs];

  // 4. Find Job (Handle number vs string ID)
  const job = allJobs.find((j) => String(j.id) === String(jobId));

  const handleApply = () => {
    // 1. 로그인 체크 (localStorage 'userProfile')
    const userProfileStr = localStorage.getItem("userProfile");
    if (!userProfileStr) {
      if (confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
        navigate("/Login");
      }
      return;
    }

    const userProfile = JSON.parse(userProfileStr);

    // 2. 이미 지원했는지 체크 (선택사항, 하지만 UX상 좋음)
    const appsStr = localStorage.getItem("db_applications");
    const apps = appsStr ? JSON.parse(appsStr) : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasApplied = apps.some((app: any) => String(app.jobId) === String(jobId) && app.userId === userProfile.email); // userProfile.email을 ID처럼 사용한다고 가정

    if (hasApplied) {
      alert("이미 지원한 공고입니다.");
      return;
    }

    // 3. 지원 데이터 생성
    const newApplication = {
      id: crypto.randomUUID(), // 최신 브라우저 기준
      jobId: jobId,
      userId: userProfile.email, // 유니크 키로 이메일 사용
      applicantName: userProfile.name || "이름없음",
      applicantPhone: userProfile.phone || "010-0000-0000",
      applicantEmail: userProfile.email,
      appliedAt: new Date().toISOString(),
      status: "pending",
      memo: ""
    };

    // 4. 저장
    const updatedApps = [...apps, newApplication];
    localStorage.setItem("db_applications", JSON.stringify(updatedApps));

    alert("성공적으로 지원되었습니다! '지원자 관리'에서 확인 가능합니다.");
  };

  if (!job) {
    return <div className="p-20 text-center">공고를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* 상단 네비게이션 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-bold transition-all"
        >
          <FiArrowLeft /> 목록으로 돌아가기
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 상세 내용 */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-lg">
                  {job.company}
                </span>
                {job.isUrgent && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg">
                    급구
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight">
                {job.title}
              </h1>

              <div className="grid grid-cols-2 gap-6 py-8 border-y border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <FiDollarSign />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">급여</p>
                    <p className="font-bold text-gray-900">{job.pay}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <FiMapPin />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">근무지</p>
                    <p className="font-bold text-gray-900">
                      {job.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <FiClock />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">시간</p>
                    <p className="font-bold text-gray-900">{job.jobType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <FiCalendar />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">기간</p>
                    <p className="font-bold text-gray-900">{job.deadline || "채용시까지"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4">상세 모집요강</h3>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  {/* 동적 데이터 렌더링 */}
                  {job.description ? (
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  ) : (
                    <p>안녕하세요, {job.company}입니다. 상세 내용은 문의 바랍니다.</p>
                  )}

                  {job.benefits && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-bold text-sm text-gray-700 mb-2">복리후생</h4>
                      <p className="whitespace-pre-wrap text-sm">{job.benefits}</p>
                    </div>
                  )}

                  <p className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm italic mt-4">
                    ※ 본 공고는 JOB-ALBA 시스템에 의해 검증된 안전한 공고입니다.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* 오른쪽: 플로팅 지원 바 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-50 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-gray-400 font-medium mb-1">
                  지원 마감일
                </p>
                <div className="text-lg font-bold text-gray-900">
                  {job.deadline || "상시채용"}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleApply}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                  즉시 지원하기
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-2 font-bold text-gray-600 hover:bg-gray-50">
                    <FiHeart /> 스크랩
                  </button>
                  <button className="flex-1 py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-2 font-bold text-gray-600 hover:bg-gray-50">
                    <FiShare2 /> 공유
                  </button>
                </div>
              </div>
              <p className="text-center text-[11px] text-gray-300 mt-6 leading-tight">
                허위 공고를 등록하거나 금품을 요구하는 경우
                <br />
                고객센터로 신고해주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetail;
