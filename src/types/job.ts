export interface Job {
    id: number | string; // Allow string IDs for UUIDs generated at runtime
    title: string;
    company: string;
    location: string;
    category: string;
    jobType: string;
    pay: string;
    experience: string;
    education: string;
    description: string;
    responsibilities: string;
    qualifications: string;
    benefits?: string;
    deadline: string;
    tags: string[];
    isUrgent?: boolean;
    contactEmail?: string;
    contactPhone?: string;
    postedAt?: string;
    menu?: string; // Main category mapping
    status?: 'active' | 'closed'; // 공고 상태 (진행중, 마감)
}
