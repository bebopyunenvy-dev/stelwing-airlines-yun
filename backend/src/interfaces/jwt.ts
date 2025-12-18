// JWT 相關介面定義
import type { ApiResponse } from './api.js';
import type { Member } from './models.js';

export interface JwtPayload {
  user_id: number;
}

export interface LoginSuccessResponse extends ApiResponse {
  success: true;
  data: {
    member: Omit<Member, 'password_hash'>;
    token: string;
  };
}