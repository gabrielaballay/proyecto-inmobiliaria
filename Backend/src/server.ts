import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log("====================================");
    console.log("🏠 Backend API");
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log("====================================");
});
