export interface User {
  id: string;
  email: string;
  fullName: string;
  accountType: 'seller';
  emailVerified: boolean;
  termsAccepted: boolean;
  accountStatus: 'ACTIVE' | 'LOCKED' | 'BANNED';
  probationStatus?: string;
}

export interface SellerStats {
  totalProducts: number;
  publishedProducts: number;
  totalViews: number;
}

export interface ViewsData {
  date: string;
  views: number;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  imageUrl?: string;
  category?: string;
  skinTypes?: string[];
  concerns?: string[];
  ingredients: string;
  purchaseUrl?: string;
  views: number;
  published: boolean;
}

export interface Violation {
  id: string;
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  penaltyApplied: string;
}

export interface Appeal {
  id: string;
  violationId: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  accountType: 'seller';
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface AcceptTermsRequest {
  signatureData: string;
}

export interface TopProduct {
  id: string;
  name: string;
  views: number;
  imageUrl?: string;
}
