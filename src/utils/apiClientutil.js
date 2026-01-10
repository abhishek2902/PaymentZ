// src/utils/apiClientutil.js

export async function apiRequest(url, method = "GET", data = null, isQuery = false) {
  const token = localStorage.getItem("token");

  let finalUrl = url;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Attach token if present
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  // If API expects query params instead of body
  if (isQuery && data) {
    const params = new URLSearchParams(data).toString();
    finalUrl = `${url}?${params}`;
  } else if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(finalUrl, options);

  let result;
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(result?.message || "API request failed");
  }

  return result;
}