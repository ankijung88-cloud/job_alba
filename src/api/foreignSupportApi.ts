
export interface Post {
    id: number;
    title: string;
    date: string;
    summary: string;
    content?: string; // 상세 내용 추가
}

export interface CategoryContent {
    title: string;
    subtitle: string;
    color: string;
    posts: Post[];
}

const mockData: Record<string, CategoryContent> = {
    "Visa-Check": {
        title: "비자 진위 확인",
        subtitle: "외국인 근로자의 비자 유효성을 실시간으로 확인하세요.",
        color: "blue",
        posts: [
            {
                id: 1,
                title: "외국인 등록증 진위여부 확인 가이드",
                date: "2024.01.10",
                summary: "하이코리아 사이트를 통한 간편 조회 방법을 안내해 드립니다.",
                content: `
                    <h3>외국인 등록증 진위여부 확인 가이드</h3>
                    <p>외국인 근로자를 채용할 때 가장 먼저 확인해야 할 것은 체류 자격의 유효성입니다.</p>
                    <p>하이코리아(www.hikorea.go.kr) 웹사이트를 이용하면 간편하게 진위 여부를 확인할 수 있습니다.</p>
                    <br/>
                    <h4>조회 절차</h4>
                    <ol>
                        <li>하이코리아 접속 > 정보조회 > 등록증 유효성 조회</li>
                        <li>외국인등록번호 및 발급일자 입력</li>
                        <li>본인인증 또는 공인인증서 로그인 불필요 (비회원 조회 가능)</li>
                    </ol>
                    <br/>
                    <p>만약 조회 결과가 '유효하지 않음'으로 나온다면 즉시 관할 출입국관리사무소에 문의하시기 바랍니다.</p>
                `
            },
            {
                id: 2,
                title: "불법 체류자 고용 방지를 위한 체크리스트",
                date: "2024.01.05",
                summary: "고용 전 반드시 확인해야 할 필수 서류 목록입니다.",
                content: "상세 내용이 포함된 게시글입니다. (예시)"
            },
            {
                id: 3,
                title: "위조 등록증 식별 요령",
                date: "2023.12.28",
                summary: "육안으로 식별 가능한 홀로그램 및 인쇄 특징을 알려드립니다.",
                content: "상세 내용이 포함된 게시글입니다. (예시)"
            },
        ]
    },
    "Language": {
        title: "언어능력별 검색",
        subtitle: "TOPIK 등급 및 소통 가능한 언어별로 인재를 찾으세요.",
        color: "teal",
        posts: [
            {
                id: 1,
                title: "TOPIK 등급별 한국어 구사 능력 기준",
                date: "2024.01.12",
                summary: "3급과 4급의 실질적인 소통 능력 차이를 비교해 드립니다.",
                content: "상세 내용이 포함된 게시글입니다. (예시)"
            },
            {
                id: 2,
                title: "업무 현장에서 필요한 필수 한국어 표현",
                date: "2024.01.08",
                summary: "제조업 현장에서 자주 쓰이는 안전 용어 매뉴얼입니다.",
                content: "상세 내용이 포함된 게시글입니다. (예시)"
            },
        ]
    },
    "E-9-Manage": {
        title: "고용허가제(E-9) 안내",
        subtitle: "E-9 비자 근로자 채용 및 체류 관리 절차입니다.",
        color: "indigo",
        posts: [
            { id: 1, title: "2025년 고용허가제 쿼터 및 신청 일정", date: "2024.01.10", summary: "올해 분기별 신규 배정 인원 및 신청 기간 안내입니다." },
            { id: 2, title: "E-9 근로자 입국 후 필수 교육 절차", date: "2024.01.02", summary: "취업 교육 시간 및 배치 전 건강검진 가이드입니다." },
            { id: 3, title: "사업장 변경 신청 및 절차", date: "2023.12.20", summary: "근로자 귀책 또는 사업주 귀책에 따른 변경 절차 차이점입니다." },
        ]
    },
    "F-4-Recruit": {
        title: "동포(F-4) 채용 관리",
        subtitle: "재외동포(F-4) 단순노무 분야 취업 제한 및 허용 범위 안내.",
        color: "purple",
        posts: [
            { id: 1, title: "F-4 비자 소지자의 단순노무 취업 금지 직종", date: "2024.01.05", summary: "건설업 일용직 등 취업이 제한되는 세부 업종 리스트입니다." },
            { id: 2, title: "재외동포 채용 시 4대보험 적용 여부", date: "2023.12.15", summary: "국민연금 가입 대상 국가 및 건강보험 적용 기준입니다." },
        ]
    },
    "D-2-PartTime": {
        title: "유학생(D-2) 시간제 취업",
        subtitle: "유학생 아르바이트 허용 시간 및 신고 절차.",
        color: "yellow",
        posts: [
            { id: 1, title: "유학생 시간제 취업허가서 작성 요령", date: "2024.01.11", summary: "학교 유학생 담당자 서명 필수 및 하이코리아 신고 방법입니다." },
            { id: 2, title: "학위 과정별 주당 허용 시간 (학사/석사)", date: "2024.01.03", summary: "한국어 능력(TOPIK)에 따른 시간 제한 차등 적용 표입니다." },
        ]
    },
    "Contract": {
        title: "표준근로계약(영문/자국어)",
        subtitle: "외국인 근로자를 위한 다국어 표준 근로계약서 양식.",
        color: "gray",
        posts: [
            { id: 1, title: "표준근로계약서 (한국어/영어 병기)", date: "2024.01.01", summary: "고용노동부 제공 최신 표준 양식 다운로드 (HWP/DOC)." },
            { id: 2, title: "농축산업 분야 전용 근로계약서", date: "2023.12.25", summary: "휴게시간 및 숙소 제공 관련 특약 사항이 포함된 양식입니다." },
        ]
    },
    "Support": {
        title: "외국인 등록 지원",
        subtitle: "외국인등록증 발급 및 체류지 변경 신고 대행 안내.",
        color: "green",
        posts: [
            { id: 1, title: "외국인등록증 발급 신청 서류 및 수수료", date: "2024.01.09", summary: "통합신청서 작성법 및 여권용 사진 규격 안내입니다." },
            { id: 2, title: "체류지 변경 신고 (전입신고) 의무", date: "2023.12.10", summary: "이사 후 14일 이내 신고 위반 시 과태료 안내입니다." },
        ]
    },
    "Tax": {
        title: "외국인 근로소득세",
        subtitle: "단일세율 적용 신청 및 연말정산 가이드.",
        color: "slate",
        posts: [
            { id: 1, title: "외국인 근로자 단일세율(19%) 신청 방법", date: "2024.01.08", summary: "급여 수준에 따라 종합과세와 분리과세 중 유리한 것을 선택하세요." },
            { id: 2, title: "외국인 연말정산 인적공제 범위", date: "2023.12.01", summary: "본국 거주 가족 부양가족 공제 가능 여부 및 서류입니다." },
        ]
    },
    "Insurance": {
        title: "외국인 전용 보험",
        subtitle: "출국만기보험, 보증보험 등 외국인 전용 4대 보험.",
        color: "orange",
        posts: [
            { id: 1, title: "출국만기보험 가입 및 보험료 산정", date: "2024.01.07", summary: "퇴직금을 대체하는 출국만기보험의 월 적립액 기준입니다." },
            { id: 2, title: "임금체불 보증보험 가입 안내", date: "2023.11.20", summary: "E-9 근로자 고용 사업장의 필수 가입 항목입니다." },
        ]
    },
    "Counsel": {
        title: "통번역 서비스",
        subtitle: "다국어 통역 지원 및 고충 상담 센터 연결.",
        color: "red",
        posts: [
            { id: 1, title: "외국인력상담센터(1577-0071) 이용 안내", date: "2024.01.04", summary: "콜센터 운영 시간 및 지원 가능한 언어 목록입니다." },
            { id: 2, title: "긴급 의료/법률 통역 지원 서비스", date: "2023.10.15", summary: "야간 및 휴일 응급 상황 발생 시 통역 지원 요청 방법입니다." },
        ]
    },
};

// Simulate Async API Call
export const fetchCategoryContents = async (categoryId: string): Promise<CategoryContent> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = mockData[categoryId];
            if (data) {
                resolve(data);
            } else {
                // Fallback for unknown categories
                resolve({
                    title: "외국인 고용지원",
                    subtitle: "관련 정보를 불러올 수 없습니다.",
                    color: "gray",
                    posts: []
                });
            }
        }, 500); // 0.5s Network Delay Simulation
    });
};

export const fetchPostDetail = async (categoryId: string, postId: number): Promise<Post | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const category = mockData[categoryId];
            if (category) {
                const post = category.posts.find(p => p.id === postId);
                resolve(post || null);
            } else {
                resolve(null);
            }
        }, 300);
    });
};
