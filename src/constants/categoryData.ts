// categoryData.ts (예시)
export const CATEGORY_DETAILS: Record<
  string,
  { description: string; tags: string[]; themeColor: string }
> = {
  스타트업: {
    description: "성장 가능성이 높은 유망 스타트업의 채용 공고를 확인하세요.",
    tags: ["#스톡옵션", "#유연근무", "#성장기회"],
    themeColor: "indigo",
  },
  "서울 전체": {
    description:
      "대한민국 경제의 중심, 서울의 모든 일자리를 한눈에 확인하세요.",
    tags: ["#역세권", "#교통편리", "#다양한인프라"],
    themeColor: "blue",
  },
  "E-9": {
    description:
      "비전문취업(E-9) 비자 소지자를 위한 안전하고 신뢰할 수 있는 일자리입니다.",
    tags: ["#비자지원", "#숙소제공", "#한국어교육"],
    themeColor: "red",
  },
  // 필요한 카테고리를 계속 추가...
};
