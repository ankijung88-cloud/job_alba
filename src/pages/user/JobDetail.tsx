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
import { JOBS_BY_CATEGORY } from "../../data_User/categoryJobs";

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // 모든 카테고리를 뒤져서 ID가 일치하는 공고 찾기 (실제로는 API 호출 영역)
  const allJobs = Object.values(JOBS_BY_CATEGORY).flat();
  const job = allJobs.find((j) => j.id === Number(jobId));

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
                      서울시 강남구 테헤란로
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <FiClock />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">시간</p>
                    <p className="font-bold text-gray-900">09:00 ~ 18:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <FiCalendar />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">기간</p>
                    <p className="font-bold text-gray-900">6개월 이상</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4">상세 모집요강</h3>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  <p>
                    안녕하세요, {job.company}입니다. 저희와 함께 성장할 열정적인
                    인재를 모집합니다.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>담당 업무: 해당 카테고리 관련 업무 보조 및 운영</li>
                    <li>지원 자격: 성별 무관, 경력 무관 (신입 환영)</li>
                    <li>우대 사항: 관련 자격증 소지자, 인근 거주자</li>
                  </ul>
                  <p className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm italic">
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
                  마감까지 D-5
                </p>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[70%]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
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
