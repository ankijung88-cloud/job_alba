import { useState, useEffect } from "react";
import { fetchPaidCategoryContents, fetchPaidServiceDetail, type PaidCategoryContent, type PaidPost } from "../../api/paidServiceApi";
import { FiCheckCircle, FiStar, FiCreditCard, FiLoader, FiX } from "react-icons/fi";

interface PaidServiceBoardProps {
    subName: string;
}

const PaidServiceBoard = ({ subName }: PaidServiceBoardProps) => {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<PaidCategoryContent | null>(null);
    const [selectedPost, setSelectedPost] = useState<PaidPost | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchPaidCategoryContents(subName);
                setContent(data);
            } catch (error) {
                console.error("Failed to load paid service data", error);
            } finally {
                setLoading(false);
            }
        };

        if (subName) {
            loadData();
        }
    }, [subName]);

    const handlePostClick = async (post: PaidPost) => {
        // 이미 데이터가 충분하다면 바로 보여줄 수도 있지만, 여기선 API 호출 흉내
        setDetailLoading(true);
        setSelectedPost(null); // 모달 내용 초기화

        try {
            const detail = await fetchPaidServiceDetail(subName, post.id);
            setSelectedPost(detail);
        } catch (error) {
            console.error("Failed to fetch detail", error);
        } finally {
            setDetailLoading(false);
        }
    };

    const handlePurchase = () => {
        if (!selectedPost) return;

        if (window.confirm(`[${selectedPost.title}] 상품을 신청/구매 하시겠습니까?\n가격: ${selectedPost.price || "별도문의"}`)) {
            alert("서비스 신청이 성공적으로 접수되었습니다.\n담당자가 곧 연락드리거나, 비즈머니가 차감됩니다.");
            closeModal();
        }
    };

    const closeModal = () => {
        setSelectedPost(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <FiLoader className="text-4xl text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500">서비스 정보를 불러오고 있습니다...</p>
            </div>
        );
    }

    if (!content) return null;

    return (
        <div className="space-y-8">
            {/* 상단 헤더 섹션 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h2 className="text-3xl font-extrabold text-blue-900 mb-3">{content.title}</h2>
                <div className="text-lg text-blue-700 font-medium mb-4">{content.subtitle}</div>
                <p className="text-gray-600 mb-6 leading-relaxed">{content.description}</p>

                {content.benefits && content.benefits.length > 0 && (
                    <div className="bg-white/80 rounded-xl p-5 border border-blue-100">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 block">Service Benefits</span>
                        <div className="flex flex-wrap gap-4">
                            {content.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                                    <FiCheckCircle className="text-blue-500" /> {benefit}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 상품 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.posts.map((post) => (
                    <div
                        key={post.id}
                        onClick={() => handlePostClick(post)}
                        className="bg-white border-2 border-transparent hover:border-blue-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                                {subName}
                            </span>
                            {post.price && (
                                <span className="text-lg font-bold text-gray-900">
                                    {post.price}
                                </span>
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                        </h3>

                        <p className="text-gray-500 text-sm mb-6 flex-grow">
                            {post.summary}
                        </p>

                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end">
                            <button className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                상세보기 <FiStar />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 상세 모달 */}
            {(selectedPost || detailLoading) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
                    <div
                        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FiX size={24} />
                        </button>

                        {detailLoading || !selectedPost ? (
                            <div className="h-64 flex flex-col items-center justify-center">
                                <FiLoader className="text-3xl text-blue-500 animate-spin mb-3" />
                                <span className="text-gray-400">상품 정보를 불러옵니다...</span>
                            </div>
                        ) : (
                            <>
                                <div className="p-8 pb-0">
                                    <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                                        추천 상품
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPost.title}</h2>
                                    <p className="text-gray-500 mb-6">{selectedPost.summary}</p>

                                    <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                                        <h4 className="font-bold text-gray-700 mb-2 text-sm">상품 상세 내용</h4>
                                        <div dangerouslySetInnerHTML={{ __html: selectedPost.content || selectedPost.summary }} className="text-gray-600 text-sm leading-relaxed" />
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <span className="block text-xs text-gray-400 font-medium">결제 예상 금액</span>
                                        <span className="text-2xl font-black text-blue-600">{selectedPost.price || "별도 문의"}</span>
                                    </div>
                                    <button
                                        onClick={handlePurchase}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transform transition-transform active:scale-95 shadow-lg shadow-blue-200"
                                    >
                                        <FiCreditCard /> 신청하기
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaidServiceBoard;
