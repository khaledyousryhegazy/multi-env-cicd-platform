const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const mentorRoutes = require("./routes/mentor");
const progressRoutes = require("./routes/progress");
const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://aede4cc2b85704a33b5a93283a1922f2-1115593351.us-east-1.elb.amazonaws.com",
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api", progressRoutes);
app.use("/api", bookingRoutes);

app.use((req, res) => res.status(404).json({ error: "المسار غير موجود" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`),
);
