import express from "express";
import cors from "cors";
import path from "path";

import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(errorHandler);

app.use(
    "/uploads",
    express.static(
        path.resolve("uploads")
    )
);

export default app;