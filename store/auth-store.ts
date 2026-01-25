import { create } from 'zustand';

export type ServiceType = 'Age Verification' | 'Student ID' | 'Email Alternative' | 'Trial access';

export interface Session {
    id: string;
    serviceName: string;
    serviceIcon?: string; // URL or icon name
    startTime: number; // Timestamp
    infoRequested: string[]; // e.g., ["Age > 18", "Full Name"]
    status: 'active' | 'expired';
    type: ServiceType;
}

export interface Credential {
    id: string;
    issuer: string; // e.g., "Government of India", "University of Mumbai"
    type: string; // e.g., "Aadhaar", "Student Card"
    issuedAt: number;
    expiresAt?: number;
    attributes: Record<string, string | boolean | number | undefined>;
    verified: boolean;
}

export interface AuthState {
    sessions: Session[];
    history: Session[];
    credentials: Credential[];

    // Actions
    addSession: (session: Omit<Session, 'id' | 'startTime' | 'status'>) => void;
    terminateSession: (id: string) => void;
    addCredential: (credential: Credential) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    sessions: [
        {
            id: '1',
            serviceName: 'GambleFi Pro',
            startTime: Date.now() - 1000 * 60 * 15, // 15 mins ago
            infoRequested: ['Age > 18'],
            status: 'active',
            type: 'Age Verification',
        },
        {
            id: '2',
            serviceName: 'Adobe Creative Cloud',
            startTime: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
            infoRequested: ['Student Authorization'],
            status: 'active',
            type: 'Student ID',
        }
    ],
    history: [
        {
            id: 'old-1',
            serviceName: 'Cool Software Trial',
            startTime: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
            infoRequested: ['Trial Access (7 Days)'],
            status: 'expired',
            type: 'Trial access',
        }
    ],
    credentials: [
        {
            id: 'c1',
            issuer: 'Government of India',
            type: 'Aadhaar',
            issuedAt: Date.now() - 1000 * 60 * 60 * 24 * 365,
            attributes: {
                'age_over_18': true,
                'residency': 'India'
            },
            verified: true
        },
        {
            id: 'c2',
            issuer: 'Mumbai University',
            type: 'Student ID',
            issuedAt: Date.now(),
            expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
            attributes: {
                'is_student': true,
                'university': 'Mumbai University'
            },
            verified: true
        }
    ],

    addSession: (session) => set((state) => ({
        sessions: [
            {
                ...session,
                id: Math.random().toString(36).substring(7),
                startTime: Date.now(),
                status: 'active'
            },
            ...state.sessions
        ]
    })),

    terminateSession: (id) => set((state) => {
        const sessionToMove = state.sessions.find(s => s.id === id);
        if (!sessionToMove) return {};

        return {
            sessions: state.sessions.filter(s => s.id !== id),
            history: [{ ...sessionToMove, status: 'expired' }, ...state.history]
        };
    }),

    addCredential: (credential) => set((state) => ({
        credentials: [...state.credentials, credential]
    })),
}));
