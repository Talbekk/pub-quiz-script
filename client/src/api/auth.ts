const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user: {
        id: string;
        username: string;
    };
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include', // for cookies/sessions
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    },

    logout: async (): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }
    },
};
