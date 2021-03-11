import server from "./server.js";
import config from "./config/config";

const port = config.port;

server.listen(port, () => console.log(`API running on port ${port}`));
