import api, { getStorageData, setStorageData, STORAGE_KEYS } from './api';

export const userService = {
  /**
   * Get all staff users
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/auth/users', { params });
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('API /auth/users unavailable, using Mock Engine:', err.message);
    }

    let users = getStorageData(STORAGE_KEYS.USERS);

    // Search filter
    if (params.search && params.search.trim()) {
      const query = params.search.toLowerCase().trim();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (params.role && params.role !== 'All' && params.role.trim()) {
      users = users.filter((u) => u.role.toLowerCase() === params.role.toLowerCase().trim());
    }

    return {
      success: true,
      message: 'Berhasil mengambil daftar staff',
      data: users,
    };
  },

  /**
   * Get staff user by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API /users/${id} unavailable, using Mock Engine:`, err.message);
    }

    const users = getStorageData(STORAGE_KEYS.USERS);
    const user = users.find((u) => u.id === Number(id));

    if (!user) {
      return { success: false, message: 'Data staff tidak ditemukan' };
    }

    return {
      success: true,
      data: user,
    };
  },

  /**
   * Create new Staff Account (Registered by Admin)
   */
  create: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('API POST /auth/register unavailable, using Mock Engine:', err.message);
    }

    const users = getStorageData(STORAGE_KEYS.USERS);

    // Check duplicate email
    const exists = users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase().trim());
    if (exists) {
      return { success: false, message: 'Email staff sudah terdaftar di sistem' };
    }

    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const avatarList = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    ];
    const assignedAvatar =
      userData.avatar || avatarList[Math.floor(Math.random() * avatarList.length)];

    const newUser = {
      id: newId,
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      role: userData.role || 'Cashier',
      avatar: assignedAvatar,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setStorageData(STORAGE_KEYS.USERS, users);

    return {
      success: true,
      message: `Akun staff ${newUser.name} (${newUser.role}) berhasil didaftarkan!`,
      data: newUser,
    };
  },

  /**
   * Update staff details or role
   */
  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API PUT /users/${id} unavailable, using Mock Engine:`, err.message);
    }

    const users = getStorageData(STORAGE_KEYS.USERS);
    const index = users.findIndex((u) => u.id === Number(id));

    if (index === -1) {
      return { success: false, message: 'Data staff tidak ditemukan' };
    }

    users[index] = {
      ...users[index],
      name: userData.name ? userData.name.trim() : users[index].name,
      role: userData.role || users[index].role,
      status: userData.status || users[index].status,
      updatedAt: new Date().toISOString(),
    };

    setStorageData(STORAGE_KEYS.USERS, users);

    return {
      success: true,
      message: `Data staff ${users[index].name} berhasil diperbarui`,
      data: users[index],
    };
  },

  /**
   * Delete staff account
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API DELETE /users/${id} unavailable, using Mock Engine:`, err.message);
    }

    if (Number(id) === 1) {
      return { success: false, message: 'Super Admin utama tidak dapat dihapus' };
    }

    const users = getStorageData(STORAGE_KEYS.USERS);
    const filtered = users.filter((u) => u.id !== Number(id));

    setStorageData(STORAGE_KEYS.USERS, filtered);

    return {
      success: true,
      message: 'Akun staff berhasil dihapus dari sistem',
    };
  },
};

export default userService;
