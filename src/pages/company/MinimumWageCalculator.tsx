import { useState, useEffect } from "react";
import { FiDollarSign, FiClock, FiCalendar } from "react-icons/fi";

export default function MinimumWageCalculator() {
    const [year, setYear] = useState<number>(2025);
    const [hourlyWage, setHourlyWage] = useState<number>(10030); // 2025년 기준
    const [workingHours] = useState<number>(209); // 월 소정근로시간 고정
    const [monthlyWage, setMonthlyWage] = useState<number>(0);

    // 연도별 최저임금 데이터
    const wageData = {
        2025: 10030,
        2024: 9860,
    };

    useEffect(() => {
        calculateWage();
    }, [hourlyWage]);

    // 연도 변경 시 해당 연도 최저시급으로 자동 세팅
    const handleYearChange = (selectedYear: number) => {
        setYear(selectedYear);
        const wage = wageData[selectedYear as keyof typeof wageData];
        if (wage) {
            setHourlyWage(wage);
        }
    };

    const calculateWage = () => {
        const calculated = hourlyWage * workingHours;
        setMonthlyWage(calculated);
    };

    // 숫자 포맷팅 (콤마)
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("ko-KR").format(num);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                {/* 헤더 */}
                <div className="bg-blue-600 p-8 text-white text-center">
                    <h2 className="text-3xl font-black mb-2 flex items-center justify-center gap-2">
                        <FiDollarSign /> 최저임금 계산기
                    </h2>
                    <p className="opacity-90">
                        주 소정근로시간 40시간(월 209시간) 기준 예상 월급을 계산합니다.
                    </p>
                </div>

                {/* 입력 폼 */}
                <div className="p-8 space-y-8">
                    {/* 연도 선택 */}
                    <div className="flex justify-center gap-4">
                        {[2025, 2024].map((y) => (
                            <button
                                key={y}
                                onClick={() => handleYearChange(y)}
                                className={`px-6 py-2 rounded-full font-bold text-lg transition-all border-2 ${year === y
                                    ? "bg-blue-50 border-blue-600 text-blue-700"
                                    : "bg-white border-gray-200 text-gray-400 hover:border-gray-400"
                                    }`}
                            >
                                {y}년 적용
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 시급 입력 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-600 flex items-center gap-1">
                                <FiClock /> 시급(원)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={hourlyWage}
                                    onChange={(e) => setHourlyWage(Number(e.target.value))}
                                    className="w-full text-right pr-4 pl-4 py-4 text-2xl font-black text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-normal">
                                    최저: {formatNumber(wageData[year as keyof typeof wageData])}원
                                </span>
                            </div>
                        </div>

                        {/* 월 근로시간 (고정) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-600 flex items-center gap-1">
                                <FiCalendar /> 월 소정근로시간
                            </label>
                            <div className="w-full text-right pr-4 pl-4 py-4 text-2xl font-black text-gray-500 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed">
                                {workingHours}시간
                            </div>
                        </div>
                    </div>

                    {/* 결과 표시 */}
                    <div className="bg-blue-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FiDollarSign size={100} />
                        </div>
                        <p className="text-blue-200 font-medium mb-1">예상 월급여 (세전)</p>
                        <div className="text-5xl font-black tracking-tight mb-2">
                            {formatNumber(monthlyWage)} <span className="text-2xl font-medium">원</span>
                        </div>
                        <p className="text-sm text-blue-300">
                            * 주휴수당 포함 (매주 만근 시 기준)
                        </p>
                    </div>

                </div>

                {/* 하단 설명 */}
                <div className="bg-gray-50 p-6 text-xs text-gray-500 border-t border-gray-100 leading-relaxed">
                    <p className="font-bold mb-1">📢 안내사항</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>위 계산 결과는 1일 8시간, 주 5일(주 40시간) 근무하며, 월 209시간(주휴시간 35시간 포함)을 만근했을 때의 기준입니다.</li>
                        <li>세금 및 4대보험 공제 전 금액이므로 실수령액과는 차이가 있을 수 있습니다.</li>
                        <li>수습기간(3개월 이내) 동안은 최저임금의 90%까지 감액하여 지급할 수 있습니다. (단, 1년 미만 근로계약 시 적용 불가)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
