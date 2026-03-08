import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { errorHandler, notFound } from "./middleware/errorHandler";
import routes from "./routes";
import { env } from "./config/env";



const app: Application = express();

app.use(helmet());
app.use(compression());

app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV
  });
});

app.use("/api/v1", routes);

app.use(notFound);

app.use(errorHandler);



export default app;