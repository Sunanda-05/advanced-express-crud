import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import helmetConfig from "./config/helmetConfig.js";
import corsConfig from "./config/corsConfig.js";
import csrfMiddleware from "./middlewares/csrfMiddleware.js";
import rateLimitMiddleware from "./middlewares/rateLimitMiddleware.js";
import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";

import openapiSpec from "./openapi.json" with { type: "json" };

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(helmetConfig);
app.use(rateLimitMiddleware);
// app.use(csrfMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/document", documentRoutes);

app.use(errorHandler);

await connectDB();

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
