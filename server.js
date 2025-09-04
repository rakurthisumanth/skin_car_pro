import express from "express";
import cors from "cors";
import skincareRoutes from "./routes/skincareRoutes.js";
import { swaggerDocs } from "./docs/swagger.js";

const app = express();

// Enable CORS (allow all origins for now, restrict later if needed)
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/api", skincareRoutes);

// Swagger
swaggerDocs(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📖 Swagger docs available at http://0.0.0.0:${PORT}/api-docs`);
});

export default app;
