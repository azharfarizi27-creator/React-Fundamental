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
      return {
        success: false,
        message: response.data?.message || 'Email atau password salah',
      };
    } catch (err) {
      // If the backend is reached and returns an error (400, 401, 403, etc.)
      if (err.response) {
        return {
          success: false,
          message: err.response.data?.message || 'Email atau password tidak valid',
        };
      }

      console.warn('Backend offline / unreachable, fallback to local:', err.message);

      // Offline mode fallback: Only allowed if server is completely unreachable and credentials match
      const users = getStorageData(STORAGE_KEYS.USERS);
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (matchedUser && (credentials.password === 'admin123' || credentials.password === 'cashier123')) {
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

      return {
        success: false,
        message: 'Gagal menghubungi server backend. Periksa koneksi internet Anda.',
      };
    }
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
