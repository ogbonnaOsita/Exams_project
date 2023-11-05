"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const adminRouter = express_1.default.Router();
adminRouter.post("/register", adminController_1.registerAdmin);
adminRouter.post("/login", adminController_1.loginAdmin);
adminRouter
    .route("/")
    .get(authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, adminController_1.getAdmins)
    .patch(authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdminOrEditor, adminController_1.updateAdmin);
adminRouter.get("/adminProfile", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdminOrEditor, adminController_1.getAdminProfile);
adminRouter.patch("/updatePassword", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdminOrEditor, adminController_1.changeAdminPassword);
adminRouter
    .route("/profile/:id")
    .get(authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, adminController_1.getAdmin)
    .patch(authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, adminController_1.updateAdminProfile)
    .delete(authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, adminController_1.deleteAdminProfile);
adminRouter.patch("/profile/updatePassword/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, adminController_1.changeAdminPasswordProfile);
adminRouter.patch("/profile/suspend/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, adminController_1.suspendAdminProfile);
adminRouter.patch("/profile/unsuspend/:id", authMiddlewares_1.isLoggedIn, authMiddlewares_1.isAdmin, adminController_1.unsuspendAdminProfile);
exports.default = adminRouter;
//# sourceMappingURL=adminRoutes.js.map