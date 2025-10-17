/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      SIGN_UP: `${API_BASE_URL}/v1/auth/sign-up`,
      SIGN_IN: `${API_BASE_URL}/v1/auth/sign-in`,
    },
    TICKETS: {
      LIST: `${API_BASE_URL}/v1/tickets`,
      CREATE: `${API_BASE_URL}/v1/tickets`,
      BY_ID: (id: string) => `${API_BASE_URL}/v1/tickets/${id}`,
      ADD_COMMENT: (id: string) => `${API_BASE_URL}/v1/tickets/${id}/comments`,
    },
  },
} as const;

export default API_CONFIG;
