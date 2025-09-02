import express from "express";
import skincareRoutes from "./routes/skincareRoutes.js";
import { swaggerDocs } from "./docs/swagger.js";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});
// Routes
app.use("/api", skincareRoutes);

// Swagger
swaggerDocs(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Swagger docs available at http://localhost:${PORT}/api-docs`);
});


export default app;
