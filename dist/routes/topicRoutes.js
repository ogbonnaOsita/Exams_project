"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const topicController_1 = require("../controllers/topicController");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const topicRouter = express_1.default.Router();
topicRouter.get("/", topicController_1.getTopics);
topicRouter.post("/", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdminOrEditor, topicController_1.createTopic);
topicRouter.get("/:id", topicController_1.getTopic);
topicRouter.patch("/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdminOrEditor, topicController_1.updateTopic);
topicRouter.delete("/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdminOrEditor, topicController_1.deleteTopic);
topicRouter.get("/subject/:id", topicController_1.getTopicsBySubject);
exports.default = topicRouter;
//# sourceMappingURL=topicRoutes.js.map