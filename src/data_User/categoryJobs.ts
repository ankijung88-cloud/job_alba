// 공고 데이터의 타입 정의
export interface JobPost {
  id: number;
  title: string;
  company: string;
  tags: string[];
  pay: string;
  isUrgent: boolean;
}

// 카테고리별 공고 데이터
export const JOBS_BY_CATEGORY: Record<string, JobPost[]> = {
  스타트업: [
    {
      id: 1,
      title: "핀테크 서비스 운영 인재 채용",
      company: "에이비씨랩스",
      tags: ["#주5일", "#재택혼합"],
      pay: "월 320만",
      isUrgent: true,
    },
    {
      id: 2,
      title: "플랫폼 마케팅 신입 모집",
      company: "성장하는사람들",
      tags: ["#스톡옵션", "#자율복장"],
      pay: "월 280만",
      isUrgent: false,
    },
  ],
  하루알바: [
    {
      id: 101,
      title: "물류센터 단순 분류 작업",
      company: "물류로지스",
      tags: ["#당일지급", "#초보가능"],
      pay: "일 12만",
      isUrgent: true,
    },
    {
      id: 102,
      title: "전시회 안내 및 티켓 검수",
      company: "아트이벤트",
      tags: ["#당일지급", "#중식제공"],
      pay: "일 10만",
      isUrgent: false,
    },
  ],
  "E-9": [
    {
      id: 201,
      title: "제조업 현장 생산직 채용",
      company: "한국테크",
      tags: ["#숙소제공", "#비자지원"],
      pay: "월 250만+",
      isUrgent: true,
    },
    {
      id: 202,
      title: "수산물 가공 공장 인력 모집",
      company: "바다푸드",
      tags: ["#사대보험", "#연장수당"],
      pay: "월 270만+",
      isUrgent: false,
    },
  ],
  // ... 나머지 카테고리 데이터들
};
