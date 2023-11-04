import http from "http";
import app from "./app";
import "dotenv/config";

const PORT: number = Number(process.env.PORT) || 4000;

//server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
