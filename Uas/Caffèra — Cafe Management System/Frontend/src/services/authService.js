import api, { getStorageData, setStorageData, STORAGE_KEYS, initializeLocalStorageDb } from './api';

initializeLocalStorageDb();

export const authService = {
  /**
   * Login user (supports real API + instant mock fallback)
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data && response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('caffera_token', token);
        localStorage.setItem('caffera_user', JSON.stringify(user));
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.warn('API /auth/login unavailable, using Mock Auth:', err.message);
    }

    // Mock Fallback
    const users = getStorageData(STORAGE_KEYS.USERS);
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (matchedUser) {
      const mockToken = `mock_jwt_token_${matchedUser.role}_${Date.now()}`;
      const authData = {
        token: mockToken,
        expiration: new Date(Date.now() + 24 * 3600000).toISOString(),
        user: matchedUser,
      };
      localStorage.setItem('caffera_token', mockToken);
      localStorage.setItem('caffera_user', JSON.stringify(matchedUser));
      return { success: true, data: authData };
    }

    // Default to admin if email not found during demo
    const defaultUser = {
      id: 99,
      name: credentials.email.split('@')[0] || 'Staff User',
      email: credentials.email,
      role: credentials.email.includes('cashier') ? 'Cashier' : 'Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    const mockToken = `mock_jwt_token_${defaultUser.role}_${Date.now()}`;
    const authData = {
      token: mockToken,
      expiration: new Date(Date.now() + 24 * 3600000).toISOString(),
      user: defaultUser,
    };
    localStorage.setItem('caffera_token', mockToken);
    localStorage.setItem('caffera_user', JSON.stringify(defaultUser));
    return { success: true, data: authData };
  },

  /**
   * Get current logged-in user profile
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data && response.data.success) {
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      console.warn('API /auth/profile unavailable, using cached profile:', err.message);
    }

    const cachedUser = localStorage.getItem('caffera_user');
    if (cachedUser) {
      return { success: true, data: JSON.parse(cachedUser) };
    }

    return { success: false, message: 'No active session' };
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('caffera_token');
    localStorage.removeItem('caffera_user');
  },
};
