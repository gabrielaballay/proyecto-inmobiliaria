import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";

import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

const uploadPath =
    process.env.UPLOAD_PATH ??
    path.resolve("uploads");

app.use(
    "/uploads",
    express.static(uploadPath)
);

app.listen(PORT, () => {
    console.log("====================================");
    console.log("🏠 Backend API");
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log("====================================");
});
