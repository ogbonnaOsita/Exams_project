import express from "express";
import cors from "cors";
import morgan from "morgan";
import examRouter from "../routes/examRoutes";
import topicRouter from "../routes/topicRoutes";
import subjectRouter from "../routes/subjectRoutes";
import questionRouter from "../routes/questionRoutes";
import adminRouter from "../routes/adminRoutes";
import {
  globalErrHandler,
  notFoundErr,
} from "../middlewares/globalErrHandlers";

const app = express();

//=======Middlewares===========
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//========Router================
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/topics", topicRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/admins", adminRouter);

//===========Error middlewares==============
app.use(notFoundErr);
app.use(globalErrHandler);

export default app;
