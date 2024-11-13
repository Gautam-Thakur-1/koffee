import initSocket from "./config/socketConfig";
import socketEvents from "./events/socket-event";

const dotenv = require("dotenv");
dotenv.config({ path: "./.env.local" });
const dbConnect = require("./config/dbConnect");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception occured! Shutting down...");
  process.exit(1);
});
dbConnect();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server has started... on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Websocket
const io = initSocket(server);

socketEvents(io);


// handling unhandled errors
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection occured! Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});
