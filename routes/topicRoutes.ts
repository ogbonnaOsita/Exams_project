import express from "express";
import {
  createTopic,
  deleteTopic,
  getTopic,
  getTopics,
  getTopicsBySubject,
  updateTopic,
} from "../controllers/topicController";
import { isAdminOrEditor, isLoggedIn } from "../middlewares/authMiddlewares";

const topicRouter = express.Router();

topicRouter.get("/", getTopics);
topicRouter.post("/", isLoggedIn, isAdminOrEditor, createTopic);
topicRouter.get("/:id", getTopic);
topicRouter.patch("/:id", isLoggedIn, isAdminOrEditor, updateTopic);
topicRouter.delete("/:id", isLoggedIn, isAdminOrEditor, deleteTopic);
topicRouter.get("/subject/:id", getTopicsBySubject);

export default topicRouter;
