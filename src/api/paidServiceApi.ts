
export interface PaidPost {
    id: number;
    title: string;
    date: string;
    summary: string;
    content?: string;
    price?: string; // 가격 정보 추가
}

export interface PaidCategoryContent {
    title: string;
    subtitle: string;
    description: string;
    posts: PaidPost[];
    benefits: string[]; // 서비스 혜택 포인트
}

const mockData: Record<string, PaidCategoryContent> = {
    "메인 최상단 광고": {
        title: "메인 최상단 VIP 광고",
        subtitle: "구직자들의 시선이 가장 먼저 머무는 프리미엄 영역입니다.",
        description: "일 평균 5만 명의 방문자에게 귀사의 채용공고를 가장 확실하게 노출할 수 있는 기회입니다.",
        benefits: ["PC/모바일 메인 최상단 고정 노출", "기업 로고 강조 효과", "전용 배지 부여"],
        posts: [
            { id: 1, title: "1주 이용권 (Hot)", date: "상시", summary: "단기간 집중 채용이 필요한 경우 추천합니다.", price: "330,000원", content: "일주일간 메인 최상단에 고정 노출됩니다." },
            { id: 2, title: "2주 이용권 (Best)", date: "상시", summary: "가장 많은 기업이 선택하는 베스트셀러 상품입니다.", price: "550,000원", content: "2주간 노출되며 1주 대비 약 15% 할인된 가격입니다." },
            { id: 3, title: "1개월 이용권", date: "상시", summary: "장기 채용 계획이 있는 기업을 위한 알뜰형 상품입니다.", price: "990,000원", content: "1개월간 노출되며 1주 대비 약 25% 할인 효과가 있습니다." },
        ]
    },
    "급구 공고 강조": {
        title: "급구/긴급 채용 강조",
        subtitle: "빠른 채용이 필요할 때, 빨간색 강조 테두리로 시선을 사로잡으세요!",
        description: "일반 공고보다 클릭률이 평균 3배 더 높습니다.",
        benefits: ["리스트 내 붉은 테두리 강조", "'급구' 아이콘 부착", "검색 리스트 상단 노출"],
        posts: [
            { id: 1, title: "급구 아이템 5건 사용권", date: "상시", summary: "필요할 때마다 골라 쓰는 실속형 패키지", price: "55,000원" },
            { id: 2, title: "급구 아이템 10건 사용권", date: "상시", summary: "여유로운 수량으로 채용 시즌을 대비하세요.", price: "99,000원" },
        ]
    },
    "인재 연락처 열람권": {
        title: "인재 연락처 열람권",
        subtitle: "마음에 드는 인재에게 직접 먼저 연락해보세요.",
        description: "기다리지 말고 먼저 제안하세요. 적극적인 제안이 성공적인 채용의 지름길입니다.",
        benefits: ["이력서 열람 무제한", "연락처(전화번호/이메일) 확인", "면접 제의 메시지 발송 가능"],
        posts: [
            { id: 1, title: "열람권 10회", date: "상시", summary: "소규모 수시 채용에 적합합니다.", price: "50,000원" },
            { id: 2, title: "열람권 30회", date: "상시", summary: "가장 인기 있는 스탠다드 상품입니다.", price: "120,000원" },
            { id: 3, title: "열람권 50회", date: "상시", summary: "대규모 채용 시 넉넉하게 활용하세요.", price: "180,000원" },
        ]
    },
    "공고 자동 점프": {
        title: "공고 자동 점프(상단 갱신)",
        subtitle: "등록한 공고가 뒤로 밀리지 않게 주기적으로 상단으로 올려줍니다.",
        description: "매일 지정된 시간에 최신 공고처럼 다시 등록되어 지속적인 노출 효과를 누릴 수 있습니다.",
        benefits: ["지정 시간 자동 점프", "최신순 상단 노출 유지", "번거로운 재등록 불필요"],
        posts: [
            { id: 1, title: "매일 1회 점프 (1주일)", date: "상시", summary: "하루 한 번 출근 시간대에 노출!", price: "22,000원" },
            { id: 2, title: "매일 2회 점프 (1주일)", date: "상시", summary: "오전/오후 피크타임 공략!", price: "38,000원" },
        ]
    },
    // 나머지 메뉴들에 대한 기본 데이터 (Fallback)
    "타겟팅 알림 발송": {
        title: "타겟팅 알림 메시지 발송",
        subtitle: "원하는 조건의 구직자에게 채용 소식을 직접 알리세요.",
        description: "지역, 직종, 경력 등 세밀한 타겟팅으로 높은 응답률을 기대할 수 있습니다.",
        benefits: ["정밀 타겟팅 설정", "카카오톡/앱푸시 발송", "높은 열람률"],
        posts: [
            { id: 1, title: "알림 100건 발송", date: "상시", price: "20,000원", summary: "소지역 타겟팅에 적합" },
            { id: 2, title: "알림 500건 발송", date: "상시", price: "90,000원", summary: "광역 타겟팅에 적합" },
        ]
    },
    "기업 브랜드 홍보": {
        title: "기업 브랜드 홍보관",
        subtitle: "우리 회사의 매력을 스토리텔링으로 전달하세요.",
        description: "단순 공고로는 전할 수 없는 회사의 비전, 문화, 복지를 생생하게 보여줄 수 있습니다.",
        benefits: ["브랜드 인터뷰 제작", "현장 스케치 사진 촬영", "홍보관 별도 페이지 개설"],
        posts: [
            { id: 1, title: "베이직 홍보 패키지", date: "상시", price: "500,000원", summary: "인터뷰 1건 + 사진 5장" },
            { id: 2, title: "프리미엄 홍보 패키지", date: "상시", price: "1,500,000원", summary: "영상 촬영 포함 + 메인 배너 홍보" },
        ]
    },
    "서비스 이용권 구매": {
        title: "올인원 이용권 구매",
        subtitle: "채용에 필요한 모든 기능을 하나로 묶었습니다.",
        description: "개별 구매보다 최대 40% 저렴한 가격으로 모든 유료 서비스를 이용해 보세요.",
        benefits: ["공고 강조 + 열람권 + 자동 점프", "통합 할인 제공", "전담 매니저 배정"],
        posts: [
            { id: 1, title: "스타트업 패키지", date: "상시", price: "290,000원", summary: "초기 기업을 위한 필수 구성" },
            { id: 2, title: "엔터프라이즈 패키지", date: "상시", price: "890,000원", summary: "중견 기업을 위한 대용량 구성" },
        ]
    },
    "결제 내역 관리": {
        title: "결제 및 이용 내역",
        subtitle: "구매하신 서비스의 내역과 남은 기간을 확인하세요.",
        description: "투명한 결제 관리와 간편한 영수증 출력을 지원합니다.",
        benefits: ["기간별 내역 조회", "신용카드 전표 출력", "자동 결제 관리"],
        posts: [
            { id: 1, title: "최근 1개월 결제 내역 조회", date: "-", summary: "시스템에서 조회 기능을 제공합니다." },
        ]
    },
    "세금계산서 발행": {
        title: "세금계산서 및 증빙",
        subtitle: "무통장 입금 건에 대한 세금계산서 발행을 신청하세요.",
        description: "사업자 지출 증빙을 위한 필수 서류를 간편하게 신청하고 발급받을 수 있습니다.",
        benefits: ["전자세금계산서 발행", "거래명세서 출력", "이메일 자동 발송"],
        posts: [
            { id: 1, title: "세금계산서 발행 신청", date: "-", summary: "신청 폼으로 이동합니다." },
        ]
    },
    "비즈 머니 충전": {
        title: "비즈머니 충전소",
        subtitle: "미리 충전하고 5% 추가 적립 혜택을 받으세요.",
        description: "자주 서비스를 이용하신다면 비즈머니 충전이 훨씬 경제적입니다.",
        benefits: ["상시 5% 추가 적립", "간편 결제 지원", "소진 시 알림"],
        posts: [
            { id: 1, title: "10만원 충전 (+5,000원)", date: "상시", price: "100,000원", summary: "소액 충전" },
            { id: 2, title: "30만원 충전 (+15,000원)", date: "상시", price: "300,000원", summary: "인기 충전 금액" },
            { id: 3, title: "50만원 충전 (+25,000원)", date: "상시", price: "500,000원", summary: "대용량 충전" },
        ]
    }
};

export const fetchPaidCategoryContents = async (categoryId: string): Promise<PaidCategoryContent> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = mockData[categoryId];
            if (data) {
                resolve(data);
            } else {
                resolve({
                    title: categoryId,
                    subtitle: "서비스 정보를 불러오는 중입니다.",
                    description: "잠시만 기다려 주세요.",
                    benefits: [],
                    posts: []
                });
            }
        }, 400);
    });
};

export const fetchPaidServiceDetail = async (categoryId: string, postId: number): Promise<PaidPost | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const category = mockData[categoryId];
            if (category) {
                const post = category.posts.find(p => p.id === postId);
                resolve(post || null);
            } else {
                resolve(null);
            }
        }, 200);
    });
};
