import { zustandStorage } from '@/lib/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ServiceType = 'Age Verification' | 'Student ID' | 'Email Alternative' | 'Trial access';

export interface Session {
    id: string;
    serviceName: string;
    serviceIcon?: string;
    startTime: number;
    infoRequested: string[];
    status: 'active' | 'expired';
    type: ServiceType;
    verifierDid?: string;
    nonce?: string;
    proofSignature?: string;
}

export interface Credential {
    id: string;
    issuer: string;
    issuerDid?: string;
    type: string;
    issuedAt: number;
    expiresAt?: number;
    attributes: Record<string, string | boolean | number | undefined>;
    commitments?: Record<string, string>; // Map of attribute key -> Poseidon commitment
    verified: boolean;
    revocationId?: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
}

export interface AuthState {
    sessions: Session[];
    history: Session[];
    credentials: Credential[];
    notifications: Notification[];
    _hasHydrated: boolean;

    // Actions
    setHasHydrated: (state: boolean) => void;
    addSession: (session: Omit<Session, 'id' | 'startTime' | 'status'>) => void;
    terminateSession: (id: string) => void;
    addCredential: (credential: Credential) => void;
    removeCredential: (id: string) => void;
    addNotification: (title: string, message: string) => void;
    clearNotifications: () => void;
    clearHistory: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Start empty — no mocks
            sessions: [],
            history: [],
            credentials: [],
            notifications: [],
            _hasHydrated: false,

            setHasHydrated: (state) => {
                set({ _hasHydrated: state });
            },

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

            terminateSession: (id) => {
                const state = get();
                const sessionToMove = state.sessions.find(s => s.id === id);
                if (!sessionToMove) return;

                set((state) => ({
                    sessions: state.sessions.filter(s => s.id !== id),
                    history: [{ ...sessionToMove, status: 'expired' }, ...state.history],
                    notifications: [
                        {
                            id: Math.random().toString(36),
                            title: 'Session Ended',
                            message: `Access to ${sessionToMove.serviceName} has been revoked.`,
                            timestamp: Date.now(),
                            read: false
                        },
                        ...state.notifications
                    ]
                }));
            },

            addCredential: (credential) => {
                const state = get();
                const existing = state.credentials.find(c => c.type === credential.type);

                if (existing) {
                    set((state) => ({
                        credentials: [
                            ...state.credentials.filter(c => c.type !== credential.type),
                            credential
                        ],
                        notifications: [
                            {
                                id: Math.random().toString(36),
                                title: 'Credential Updated',
                                message: `Your ${credential.type} has been updated.`,
                                timestamp: Date.now(),
                                read: false
                            },
                            ...state.notifications
                        ]
                    }));
                } else {
                    set((state) => ({
                        credentials: [...state.credentials, credential]
                    }));
                }
            },

            removeCredential: (id) => set((state) => ({
                credentials: state.credentials.filter(c => c.id !== id)
            })),

            addNotification: (title, message) => set((state) => ({
                notifications: [
                    {
                        id: Math.random().toString(36),
                        title,
                        message,
                        timestamp: Date.now(),
                        read: false
                    },
                    ...state.notifications
                ]
            })),

            clearNotifications: () => set({ notifications: [] }),
            clearHistory: () => set({ history: [] }),
        }),
        {
            name: 'zero-auth-store',
            storage: createJSONStorage(() => zustandStorage),
            // Don't persist internal flags
            partialize: (state) => ({
                sessions: state.sessions,
                history: state.history,
                credentials: state.credentials,
                notifications: state.notifications,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
