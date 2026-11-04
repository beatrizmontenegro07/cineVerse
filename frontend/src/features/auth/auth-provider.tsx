'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { notifyRatingsChanged } from '../ratings/events';
import * as api from './api';
import type { Credentials, Registration, User } from './types';

interface AuthState {
  user: User | null;
  status: 'loading' | 'ready' | 'error';
}
interface AuthContextValue extends AuthState {
  retry: () => void;
  login: (data: Credentials) => Promise<void>;
  register: (data: Registration) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    status: 'loading',
  });
  const [attempt, setAttempt] = useState(0);
  const currentUser = useRef<number | null>(null);
  const request = useRef<AbortController | null>(null);

  const setSession = useCallback((user: User | null) => {
    request.current?.abort();
    const changed = currentUser.current !== (user?.id ?? null);
    currentUser.current = user?.id ?? null;
    setState({ user, status: 'ready' });
    if (changed) notifyRatingsChanged();
  }, []);

  useEffect(() => {
    const refresh = () => {
      request.current?.abort();
      const controller = new AbortController();
      request.current = controller;
      api
        .getSession(controller.signal)
        .then((user) => {
          if (!controller.signal.aborted) setSession(user);
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setState({ user: null, status: 'error' });
        });
    };
    const expired = () => setSession(null);
    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('cineverse:unauthorized', expired);
    return () => {
      request.current?.abort();
      window.removeEventListener('focus', refresh);
      window.removeEventListener('cineverse:unauthorized', expired);
    };
  }, [attempt, setSession]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        retry: () => {
          setState({ user: null, status: 'loading' });
          setAttempt((value) => value + 1);
        },
        login: async (data) => {
          setSession(await api.login(data));
        },
        register: async (data) => {
          setSession(await api.register(data));
        },
        logout: async () => {
          await api.logout();
          setSession(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
