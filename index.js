import express from "express";
import connectToDataBase  from "./src/database/db.js";
import dotenv from "dotenv";
import cors from "cors";

import authRoute from "./src/routes/auth.js";
import userRoute from "./src/routes/user.route.js";
import newsRoute from "./src/routes/news.route.js";
import swaggerRoute from "./src/routes/swagger.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectToDataBase();

app.use(cors());
app.use(express.json());

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/news", newsRoute);
app.use("/doc", swaggerRoute);

app.listen(port, () => {
    console.log("Servidor rodando na porta " + port)
})