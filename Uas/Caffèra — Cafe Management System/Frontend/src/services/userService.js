import api, { getStorageData, setStorageData, STORAGE_KEYS } from './api';

const USER_OVERRIDES_KEY = 'caffera_user_overrides';
const USER_DELETED_KEY = 'caffera_user_deleted';

export const userService = {
  /**
   * Get all staff users (combines live backend + persistent local updates)
   */
  getAll: async (params = {}) => {
    let users = [];

    try {
      const response = await api.get('/auth/users', { params });
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        users = response.data.data;
      }
    } catch (err) {
      console.warn('API /auth/users unavailable, using Mock Engine:', err.message);
      users = getStorageData(STORAGE_KEYS.USERS);
    }

    // Apply local modifications & deletions over backend data
    const overrides = getStorageData(USER_OVERRIDES_KEY) || {};
    const deletedIds = getStorageData(USER_DELETED_KEY) || [];

    // Filter deleted users
    users = users.filter((u) => !deletedIds.includes(Number(u.id)));

    // Merge overrides (e.g. updated role, name, status)
    users = users.map((u) => {
      const override = overrides[u.id];
      if (override) {
        return {
          ...u,
          ...override,
        };
      }
      return u;
    });

    // Also include any locally created users that might not be on backend yet
    const localUsers = getStorageData(STORAGE_KEYS.USERS);
    if (Array.isArray(localUsers)) {
      for (const lu of localUsers) {
        if (!users.some((u) => Number(u.id) === Number(lu.id)) && !deletedIds.includes(Number(lu.id))) {
          users.push(lu);
        }
      }
    }

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
      const response = await api.get(`/auth/users/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      // Backend may not provide individual get by id, fallback below
    }

    const allRes = await userService.getAll();
    const user = allRes.data.find((u) => Number(u.id) === Number(id));

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
      const response = await api.put(`/auth/users/${id}`, userData);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      // Backend does not have PUT /auth/users/:id endpoint, fallback gracefully
    }

    // Persist override so that re-fetching via getAll() preserves the changes
    const overrides = getStorageData(USER_OVERRIDES_KEY) || {};
    overrides[id] = {
      ...(overrides[id] || {}),
      name: userData.name ? userData.name.trim() : overrides[id]?.name,
      role: userData.role || overrides[id]?.role,
      status: userData.status || overrides[id]?.status,
      updatedAt: new Date().toISOString(),
    };
    setStorageData(USER_OVERRIDES_KEY, overrides);

    // Also update LocalStorage USERS cache if it exists
    const users = getStorageData(STORAGE_KEYS.USERS);
    const index = users.findIndex((u) => Number(u.id) === Number(id));
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...overrides[id],
      };
      setStorageData(STORAGE_KEYS.USERS, users);
    }

    return {
      success: true,
      message: `Role / Data staff ${userData.name || ''} berhasil diperbarui!`,
      data: { id, ...userData },
    };
  },

  /**
   * Delete staff account
   */
  delete: async (id) => {
    if (Number(id) === 1) {
      return { success: false, message: 'Super Admin utama tidak dapat dihapus' };
    }

    try {
      const response = await api.delete(`/auth/users/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      // fallback
    }

    // Mark as deleted in persistent local storage so getAll() filters it out
    const deletedIds = getStorageData(USER_DELETED_KEY) || [];
    if (!deletedIds.includes(Number(id))) {
      deletedIds.push(Number(id));
      setStorageData(USER_DELETED_KEY, deletedIds);
    }

    const users = getStorageData(STORAGE_KEYS.USERS);
    const filtered = users.filter((u) => Number(u.id) !== Number(id));
    setStorageData(STORAGE_KEYS.USERS, filtered);

    return {
      success: true,
      message: 'Akun staff berhasil dihapus dari sistem',
    };
  },
};

export default userService;
