import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';
import { User, Session } from '../types/user';

describe('authStore', () => {
  const mockUser: User = {
    id: '123',
    email: 'test@example.com',
    fullName: 'Test User',
    role: 'customer',
    createdAt: '2024-01-01T00:00:00Z',
  };

  const mockAdminUser: User = {
    id: '456',
    email: 'admin@example.com',
    fullName: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  };

  const mockSession: Session = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: Date.now() + 3600000,
  };

  beforeEach(() => {
    // Reset auth store before each test
    useAuthStore.getState().reset();
  });

  describe('setUser', () => {
    it('should set user in state', () => {
      const { setUser } = useAuthStore.getState();
      
      setUser(mockUser);
      
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
    });

    it('should set user to null', () => {
      const { setUser } = useAuthStore.getState();
      
      setUser(mockUser);
      setUser(null);
      
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });
  });

  describe('setSession', () => {
    it('should set session in state', () => {
      const { setSession } = useAuthStore.getState();
      
      setSession(mockSession);
      
      const state = useAuthStore.getState();
      expect(state.session).toEqual(mockSession);
    });

    it('should set session to null', () => {
      const { setSession } = useAuthStore.getState();
      
      setSession(mockSession);
      setSession(null);
      
      const state = useAuthStore.getState();
      expect(state.session).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      const { setLoading } = useAuthStore.getState();
      
      setLoading(true);
      
      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(true);
    });

    it('should set loading state to false', () => {
      const { setLoading } = useAuthStore.getState();
      
      setLoading(true);
      setLoading(false);
      
      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin user', () => {
      const { setUser, isAdmin } = useAuthStore.getState();
      
      setUser(mockAdminUser);
      
      expect(isAdmin()).toBe(true);
    });

    it('should return false for customer user', () => {
      const { setUser, isAdmin } = useAuthStore.getState();
      
      setUser(mockUser);
      
      expect(isAdmin()).toBe(false);
    });

    it('should return false when no user is set', () => {
      const { isAdmin } = useAuthStore.getState();
      
      expect(isAdmin()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user and session on logout', async () => {
      const { setUser, setSession, logout } = useAuthStore.getState();
      
      setUser(mockUser);
      setSession(mockSession);
      
      await logout();
      
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
    });

    it('should set loading state during logout', async () => {
      const { setUser, logout } = useAuthStore.getState();
      
      setUser(mockUser);
      
      const logoutPromise = logout();
      
      // Check loading state is true during logout
      let state = useAuthStore.getState();
      expect(state.isLoading).toBe(true);
      
      await logoutPromise;
      
      // Check loading state is false after logout
      state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { setUser, setSession, setLoading, reset } = useAuthStore.getState();
      
      setUser(mockUser);
      setSession(mockSession);
      setLoading(true);
      
      reset();
      
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(false);
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();
      
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(false);
    });
  });
});
