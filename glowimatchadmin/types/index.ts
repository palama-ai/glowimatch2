export interface User {
    id: string;
    email: string;
    full_name?: string;  // Backend uses full_name not name
    name?: string;       // Alias for compatibility
    avatar?: string;
    role: 'user' | 'seller' | 'admin';
    referral_code?: string;
    subscriptionPlan?: 'free' | 'basic' | 'premium';
    disabled: boolean;
    statusMessage?: string;
    createdAt?: string;
    lastActive?: string;
    email_verified?: boolean;
}

export interface Stats {
    totalUsers: number;
    activeUsers: number;
    disabledUsers: number;
    subscribedUsers: number;
    liveUsers: number;
}

export interface AnalyticsData {
    date: string;
    users: number;
    signups: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    image?: string;
    price: number;
    published: boolean;
    sellerId: string;
    sellerName: string;
    createdAt: string;
}

export interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    published: boolean;
    authorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export interface Notification {
    id: string;
    title: string;
    body: string;
    sentTo: string;
    createdAt: string;
}

export interface Session {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    currentPage: string;
    lastActivity: string;
    device: string;
}

export interface Appeal {
    id: string;
    userId: string;
    userName: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export interface ProblemSeller {
    id: string;
    sellerId: string;
    sellerName: string;
    reason: string;
    locked: boolean;
    createdAt: string;
}

export interface BlacklistItem {
    id: string;
    type: 'email' | 'ip' | 'domain';
    value: string;
    reason: string;
    createdAt: string;
}

export interface SignupBlockSettings {
    blockUserSignup: boolean;
    blockSellerSignup: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiError {
    message: string;
    code?: string;
}
