const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

let onUnauthorized = () => {};

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getSavedUser = () => {
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved && getToken() ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const toQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const text = query.toString();
  return text ? `?${text}` : "";
};

const request = async (path, { method = "GET", body, auth = true } = {}) => {
  const headers = {};

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Check your connection and try again.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && auth && getToken()) {
      onUnauthorized();
    }

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      throw new Error(data.errors.map((error) => error.message).join(". "));
    }

    throw new Error(data.message || "Something went wrong. Try again.");
  }

  return data;
};

// Auth
export const loginUser = (email, password) =>
  request("/auth/login", { method: "POST", body: { email, password }, auth: false });

export const registerUser = (userData) =>
  request("/auth/register", { method: "POST", body: userData, auth: false });

export const changePassword = (currentPassword, newPassword) =>
  request("/auth/change-password", {
    method: "PUT",
    body: { currentPassword, newPassword },
  });

// Normal user
export const getStores = (filters) => request(`/stores${toQuery(filters)}`);

export const submitRating = (storeId, rating) =>
  request("/ratings", { method: "POST", body: { storeId, rating } });

export const updateRating = (storeId, rating) =>
  request("/ratings", { method: "PUT", body: { storeId, rating } });

// Store owner
export const getOwnerDashboard = () => request("/owner/dashboard");

// Admin
export const getAdminDashboard = () => request("/admin/dashboard");

export const getAdminUsers = (filters) =>
  request(`/admin/users${toQuery(filters)}`);

export const getAdminUserById = (userId) => request(`/admin/users/${userId}`);

export const createAdminUser = (userData) =>
  request("/admin/users", { method: "POST", body: userData });

export const getStoreOwners = () =>
  request(`/admin/users${toQuery({ role: "STORE_OWNER" })}`);

export const getAdminStores = (filters) =>
  request(`/admin/stores${toQuery(filters)}`);

export const createAdminStore = (storeData) =>
  request("/admin/stores", { method: "POST", body: storeData });
