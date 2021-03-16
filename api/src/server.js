import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import "./auth/auth";
import userSignInUpRouter from "./routes/user-sing-in-up";
import AlexRouter from "./routes/alex-crud";

import config from "./config/config";
const server = express();

// Middleware
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

server.use(cors());
server.use(morgan("dev"));
server.use(express.json());

// Routers
console.log({ origin: `${config.hostUI}:${config.portUI}` }, "\n");
server.use(cors({ origin: `${config.hostUI}:${config.portUI}` }));
//server.use(cors({ origin: "*" }));
server.use("/api/auth", userSignInUpRouter);
server.use("/api/alex", AlexRouter);

//Serves all the request which includes /images in the url from Images folder
server.use("/images", express.static(__dirname + "/../images"));

//Routes
server.get("/", (req, res) => {
  res.status(200).json({ hello: "Hi!" });
});

module.exports = server;
