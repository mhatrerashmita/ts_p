// import express, { Express, Request, Response } from "express";
// import dotenv from "dotenv";

// dotenv.config();

// const app: Express = express();
// const port = process.env.PORT || 3000;

// app.get("/", (req: Request, res: Response) => {
//     res.send("Express + TypeScript Server");
// });

// app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`);
// });
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
