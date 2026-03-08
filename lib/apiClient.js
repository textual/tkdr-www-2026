import { authenticatedFetch } from "./authenticatedFetch";
import { API_URL } from "./constants";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  console.log("apiClient handleResponse", response.ok, data);
  if (!response.ok) {
    // Return the full error object from the server
    return {
      ok: false,
      status: response.status,
      error: data.error || "An unknown error occurred.",
    };
  }

  return {
    ok: true,
    status: response.status,
    data: data,
  };
}

export const apiClient = {
  delete: async (endpoint, options = {}) => {
    const res = await authenticatedFetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "DELETE",
    });
    return handleResponse(res);
  },

  get: async (endpoint, options = {}) => {
    const res = await authenticatedFetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "GET",
    });
    return handleResponse(res);
  },

  post: async (endpoint, body, options = {}) => {
    const res = await authenticatedFetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    console.log("apiClient post response", res);
    return handleResponse(res);
  },

  put: async (endpoint, body, options = {}) => {
    const res = await authenticatedFetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    console.log("apiClient put response", res);
    return handleResponse(res);
  },

  // unatuthenicated fetch - get
  uGet: async (endpoint, options = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "GET",
    });
    return handleResponse(res);
  },

  // unatuthenicated fetch - post
  uPost: async (endpoint, body, options = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    console.log("apiClient post response", res);
    return handleResponse(res);
  },
  // Add other methods like put, delete, etc.
};
