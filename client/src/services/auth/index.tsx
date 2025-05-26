import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

export interface User {
    id: string;
    username: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    user: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const key = 'tanstack.auth.user';

function getStoredUser(): User | null {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
}

function setStoredUser(user: User | null) {
    if (user) {
        localStorage.setItem(key, JSON.stringify(user));
    } else {
        localStorage.removeItem(key);
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User | null>(getStoredUser());
    const isAuthenticated = !!user;

    const setUser = useCallback((user: User | null) => {
        setStoredUser(user);
        setUserState(user);
    }, []);

    const clearUser = useCallback(() => {
        setStoredUser(null);
        setUserState(null);
    }, []);

    useEffect(() => {
        setUserState(getStoredUser());
    }, []);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, setUser, clearUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
