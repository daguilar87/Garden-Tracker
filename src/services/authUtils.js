export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch("https://gardenflask.fly.dev/api/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    return data.access_token;
  } catch (err) {
    console.error("Token refresh error:", err);
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    return true;
  }
};