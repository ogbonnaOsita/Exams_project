import jwt from "jsonwebtoken";
import "dotenv/config";

const secret = process.env.JWT_SECRET || "anykey";

export const generateToken = (id: number) => {
  return jwt.sign({ id }, secret, { expiresIn: "5d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
};
