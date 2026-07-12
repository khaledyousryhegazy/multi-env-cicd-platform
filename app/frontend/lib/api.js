const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://a77187f9f76e94a14ad6ea8067fced63-1474404180.us-east-1.elb.amazonaws.com:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "حدث خطأ غير متوقع");
  return data;
}

export const api = {
  getMentor: () => request("/mentor"),
  getSurahs: () => request("/surahs"),
  getAvailability: () => request("/availability"),

  createStudent: (payload) =>
    request("/students", { method: "POST", body: JSON.stringify(payload) }),
  getStudentByEmail: (email) =>
    request(`/students/by-email/${encodeURIComponent(email)}`),
  getStudentProgress: (studentId) => request(`/students/${studentId}/progress`),
  updateStudentProgress: (studentId, payload) =>
    request(`/students/${studentId}/progress`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createBooking: (payload) =>
    request("/bookings", { method: "POST", body: JSON.stringify(payload) }),

  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  getBookings: (token) =>
    request("/bookings", { headers: { Authorization: `Bearer ${token}` } }),
  updateBookingStatus: (token, id, status) =>
    request(`/bookings/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),
};
