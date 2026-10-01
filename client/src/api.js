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
