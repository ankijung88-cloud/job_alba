import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CompanyNavigation from "./CompanyNavigation";
import { FiGlobe, FiCheckCircle, FiFileText, FiBookOpen, FiArrowRight, FiX, FiLoader } from "react-icons/fi";
import { fetchCategoryContents, fetchPostDetail, type CategoryContent, type Post } from "../../api/foreignSupportApi";

const ForeignSupportBoard = () => {
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<CategoryContent | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Fetch Category Content
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetchCategoryContents(id)
            .then(data => setContent(data))
            .finally(() => setLoading(false));
    }, [id]);

    // Handle Post Click
    const handlePostClick = async (postId: number) => {
        if (!id) return;
        setDetailLoading(true);
        // Show modal immediately with loading state
        setSelectedPost({ id: postId, title: "Loading...", date: "", summary: "" } as Post);

        try {
            const post = await fetchPostDetail(id, postId);
            setSelectedPost(post);
        } catch (e) {
            console.error("Failed to fetch post detail", e);
        } finally {
            setDetailLoading(false);
        }
    };

    if (loading || !content) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FiLoader className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">콘텐츠를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <CompanyNavigation />

            <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
                {/* Header Section */}
                <div className={`bg-white rounded-3xl p-10 border border-gray-200 shadow-sm mb-10 relative overflow-hidden group`}>
                    {/* Background Decoration */}
                    <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] opacity-10 bg-${content.color}-500 -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity duration-500`}></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">
                            <FiGlobe className={`text-${content.color}-600`} /> Foreigner Employment Support
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                            {content.title}
                        </h1>
                        <p className="text-xl text-gray-600 font-medium max-w-2xl leading-relaxed">
                            {content.subtitle}
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Main Board */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FiBookOpen /> 최신 가이드 및 뉴스
                            <span className="text-xs font-normal text-blue-500 bg-blue-50 px-2 py-0.5 rounded ml-2">Real-time API Data</span>
                        </h2>

                        {content.posts.length > 0 ? (
                            <div className="space-y-4">
                                {content.posts.map((post: any) => (
                                    <div
                                        key={post.id}
                                        onClick={() => handlePostClick(post.id)}
                                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-200"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-3 py-1 rounded-full bg-${content.color}-50 text-${content.color}-600 text-[11px] font-bold`}>
                                                Guide
                                            </span>
                                            <span className="text-gray-400 text-xs">{post.date}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                            {post.summary}
                                        </p>
                                        <div className="mt-4 flex items-center text-sm font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
                                            자세히 보기 <FiArrowRight className="ml-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-400">
                                <FiFileText className="text-4xl mx-auto mb-4 opacity-50" />
                                <p>등록된 게시글이 없습니다.</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Side Menu or Banner */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-4">전문가의 도움이 필요하신가요?</h3>
                                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                    복잡한 외국인 채용 절차, <br />
                                    전담 노무사가 1:1로 지원해 드립니다.
                                </p>
                                <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                                    상담 신청하기
                                </button>
                            </div>
                            {/* Deco */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="font-bold text-gray-800 mb-4 text-sm">자주 찾는 질문</h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2 hover:text-blue-600 cursor-pointer">
                                    <FiCheckCircle className="mt-1 text-gray-300 min-w-4" />
                                    <span>E-9 근로자 수습기간 설정 가능 여부</span>
                                </li>
                                <li className="flex items-start gap-2 hover:text-blue-600 cursor-pointer">
                                    <FiCheckCircle className="mt-1 text-gray-300 min-w-4" />
                                    <span>외국인 근로자 퇴직금 중간정산</span>
                                </li>
                                <li className="flex items-start gap-2 hover:text-blue-600 cursor-pointer">
                                    <FiCheckCircle className="mt-1 text-gray-300 min-w-4" />
                                    <span>불법체류자 자진신고 기간 혜택</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            {/* Post Detail Modal */}
            {selectedPost && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => !detailLoading && setSelectedPost(null)}>
                    <div
                        className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl relative flex flex-col animate-fade-in-up"
                        onClick={e => e.stopPropagation()}
                    >
                        {detailLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <FiLoader className="text-3xl text-blue-600 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                                    <div className="pr-8">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold bg-${content.color}-100 text-${content.color}-700`}>
                                                {content.title}
                                            </span>
                                            <span className="text-xs text-gray-400">|</span>
                                            <span className="text-xs text-gray-400">{selectedPost.date}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                            {selectedPost.title}
                                        </h3>
                                    </div>
                                    <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <FiX className="text-xl text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-8 overflow-y-auto leading-loose text-gray-700 text-lg">
                                    {selectedPost.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                                    ) : (
                                        <p className="text-gray-500 italic">상세 내용이 없습니다.</p>
                                    )}
                                </div>
                                <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={() => setSelectedPost(null)}
                                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-transform active:scale-95"
                                    >
                                        닫기
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

export default ForeignSupportBoard;
