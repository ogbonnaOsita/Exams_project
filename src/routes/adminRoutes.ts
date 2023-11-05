import express from "express";
import {
  changeAdminPassword,
  changeAdminPasswordProfile,
  deleteAdminProfile,
  getAdmin,
  getAdminProfile,
  getAdmins,
  loginAdmin,
  registerAdmin,
  suspendAdminProfile,
  unsuspendAdminProfile,
  updateAdmin,
  updateAdminProfile,
} from "../controllers/adminController";
import {
  isAdmin,
  isAdminOrEditor,
  isLoggedIn,
} from "../middlewares/authMiddlewares";

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

adminRouter
  .route("/")
  .get(isLoggedIn, isAdmin, getAdmins)
  .patch(isLoggedIn, isAdminOrEditor, updateAdmin);

adminRouter.get("/adminProfile", isLoggedIn, isAdminOrEditor, getAdminProfile);

adminRouter.patch(
  "/updatePassword",
  isLoggedIn,
  isAdminOrEditor,
  changeAdminPassword
);

adminRouter
  .route("/profile/:id")
  .get(isLoggedIn, isAdmin, getAdmin)
  .patch(isLoggedIn, isAdmin, updateAdminProfile)
  .delete(isLoggedIn, isAdmin, deleteAdminProfile);

adminRouter.patch(
  "/profile/updatePassword/:id",
  isLoggedIn,
  isAdmin,
  changeAdminPasswordProfile
);
adminRouter.patch(
  "/profile/suspend/:id",
  isLoggedIn,
  isAdmin,
  suspendAdminProfile
);
adminRouter.patch(
  "/profile/unsuspend/:id",
  isLoggedIn,
  isAdmin,
  unsuspendAdminProfile
);

export default adminRouter;
