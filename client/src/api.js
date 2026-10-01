const API_BASE_URL = "http://localhost:5000/api";

export const loginUser = async (email, password) => {
    
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.errors) {
      throw new Error(
        data.errors.map((error) => error.message).join(", ")
      );
    }

    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const getStores = async (filters = {}) => {
    const token = localStorage.getItem("token");
  
    const params = new URLSearchParams();
  
    if (filters.name) {
      params.append("name", filters.name);
    }
  
    if (filters.address) {
      params.append("address", filters.address);
    }
  
    const response = await fetch(
      `${API_BASE_URL}/stores?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch stores");
    }
  
    return data;
  };
  export const submitRating = async (storeId, rating) => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(`${API_BASE_URL}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        storeId,
        rating,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to submit rating");
    }
  
    return data;
  };
  
  export const updateRating = async (storeId, rating) => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(`${API_BASE_URL}/ratings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        storeId,
        rating,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to update rating");
    }
  
    return data;
  };

  export const getOwnerDashboard = async () => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(
      `${API_BASE_URL}/owner/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch owner dashboard"
      );
    }
  
    return data;
  };

  export const getAdminDashboard = async () => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(
      `${API_BASE_URL}/admin/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch admin dashboard"
      );
    }
  
    return data;
  };

  export const getAdminUsers = async (filters = {}) => {
    const token = localStorage.getItem("token");
  
    const params = new URLSearchParams();
  
    if (filters.name) {
      params.append("name", filters.name);
    }
  
    if (filters.email) {
      params.append("email", filters.email);
    }
  
    if (filters.address) {
      params.append("address", filters.address);
    }
  
    if (filters.role) {
      params.append("role", filters.role);
    }
  
    if (filters.sortBy) {
      params.append("sortBy", filters.sortBy);
    }
  
    if (filters.order) {
      params.append("order", filters.order);
    }
  
    const response = await fetch(
      `${API_BASE_URL}/admin/users?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }
  
    return data;
  };

  export const getStoreOwners = async () => {
    const token = localStorage.getItem("token");
  
    const params = new URLSearchParams();
    params.append("role", "STORE_OWNER");
  
    const response = await fetch(
      `${API_BASE_URL}/admin/users?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch store owners");
    }
  
    return data;
  };

  
  export const getAdminUserById = async (userId) => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch user details"
      );
    }
  
    return data;
  };

  export const createAdminUser = async (userData) => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      if (data.errors) {
        throw new Error(
          data.errors.map((error) => error.message).join(", ")
        );
      }
  
      throw new Error(data.message || "Failed to create user");
    }
  
    return data;
  };

  export const getAdminStores = async (filters = {}) => {
    const token = localStorage.getItem("token");
  
    const params = new URLSearchParams();
  
    if (filters.name) params.append("name", filters.name);
    if (filters.email) params.append("email", filters.email);
    if (filters.address) params.append("address", filters.address);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.order) params.append("order", filters.order);
  
    const response = await fetch(
      `${API_BASE_URL}/admin/stores?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch stores");
    }
  
    return data;
  };
  
  export const createAdminStore = async (storeData) => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(`${API_BASE_URL}/admin/stores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(storeData),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      if (data.errors) {
        throw new Error(
          data.errors.map((error) => error.message).join(", ")
        );
      }
  
      throw new Error(data.message || "Failed to create store");
    }
  
    return data;
  };

  export const changePassword = async (
    currentPassword,
    newPassword
  ) => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(
      `${API_BASE_URL}/auth/change-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      if (data.errors) {
        throw new Error(
          data.errors.map((error) => error.message).join(", ")
        );
      }
  
      throw new Error(data.message || "Failed to change password");
    }
  
    return data;
  };