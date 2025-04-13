import rateLimit from "express-rate-limit";

// Maximum of 100 requests per hour
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Max requests per window
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
