const corsOptions = {
  origin: ["http://localhost:3000"], // List of allowed origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allows cookies to be sent with requests
};

export default corsOptions;
