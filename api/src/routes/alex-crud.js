import express from "express";
//import db from "../models/service-model.js";
//import { use } from "passport";
//import multer from "multer";
//const upload = multer();
const router = express.Router();
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const timeExp = 3600 * 24; // период в секундах (3600 * 24 -  сутки)
import config from "../config/config";

// GET ALL Support USERs
router.get("/", async (req, res) => {
  try {
    //    const filter = req.params.filter;
    const filter = config.pathFilter;
    const commmand =
      filter !== ""
        ? `sudo cat /etc/passwd | grep ${filter}`
        : "sudo cat /etc/passwd";
    console.log("\n commmand: \n ", commmand, "\n\n ");

    const { stdout, stderr } = await exec(commmand);

    if (stdout !== "") {
      const users = stdout.split("\n");
      const json = [];
      // console.log("\n users", users);
      for (const item of users) {
        const user = item.split(":");
        const username = user[0];
        const homedir = user[5];

        if (username !== "" && homedir !== "") {
          let resExecDir = myCache.get(`dirData${username}`);

          if (resExecDir == undefined) {
            resExecDir = await exec(`sudo du -c ${homedir} -h --max-depth=1`);
            myCache.set(`dirData${username}`, resExecDir, timeExp);
          }
          //          const resExecDir = { stdout: "empty", stderr: "" };

          const resExecPass = await exec(`sudo chage -l ${username}`);

          if (resExecDir.stdout !== "" && resExecPass.stdout !== "") {
            const folders = resExecDir.stdout;

            const t = resExecDir.stdout.split("\n");

            const total =
              t[t.length - 1] !== "" ? t[t.length - 1] : t[t.length - 2];

            const passData = resExecPass.stdout.split("\n");
            const lastChangeDate = new Date(
              Date.parse(passData[0].split(":")[1].trim())
            );
            const expiryDate = new Date(
              Date.parse(passData[3].split(":")[1].trim())
            );

            //

            json.push({
              username,
              homedir,
              folders,
              total,
              lastChangeDate,
              expiryDate,
            });
          }
          if (resExecDir.stderr !== "") {
            res.status(500).json({ err: resExecDir.stderr });
          }
        }
      }

      //console.log("users:", json);
      res.status(200).json(json);
    }
    if (stderr !== "") {
      res.status(500).json({ err: stderr });
    }
  } catch (err) {
    res.status(500).json({ err });
    console.error(err);
  }

  //     try {
  //     console.log("alsex");
  //     const services = await db.find();
  //     res.status(200).json(services);

  //     res.status(200).json({ hello: "Hi alsex" });
  //   } catch (err) {
  //     res.status(500).json({ err });
  //   }
});

// GET  BY ID
// router.get("/:id", async (req, res) => {
//   const serviceId = req.params.id;
//   try {
//     const service = await db.findById(serviceId);
//     if (!service) {
//       res
//         .status(404)
//         .json({ err: "The service with the specified id does not exist" });
//     } else {
//       res.status(200).json(service[0]);
//     }
//   } catch (err) {
//     res.status({ err: "The service information could not be retrieved" });
//   }
// });

// INSERT  INTO DB
// router.post("/", async (req, res) => {
//   const newService = req.body.data;

//   try {
//     await db.addRow(newService);
//     res.status(201).json("ok");
//   } catch (err) {
//     console.log("err", err);
//     res
//       .status(500)
//       .json({ err: "Error in adding service", message: err.message });
//   }
// });

router.put("/:id", async (req, res) => {
  const username = req.params.id;
  const expiryDate = req.body.expiryDate;

  try {
    if (expiryDate !== "" && username !== "") {
      const command = `sudo chage -E ${expiryDate} ${username}`;
      console.log("\n ----------- command ------------ \n", command);

      const resChage = await exec(command);
      console.log("\n ----------- resChage ----------- \n", resChage);

      //if (resChage.stdout !== "") {
      res.status(200).json({ res: "ok" });
      //}
      if (resChage.stderr !== "") {
        console.log(
          "\n -----------resChage.stderr ------------ \n",
          resChage.stderr
        );

        res.status(500).json({ err: resChage.stderr });
      }
    } else {
      res.status(500).json({ err: "Error iusername or expiryDate" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in updating service", message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const serviceId = req.params.id;
  try {
    const deleting = await db.removeRow(serviceId);
    console.log("deleting \n", deleting);
    res.status(204).json(deleting);
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error in deleting service", message: err.message });
  }
});

module.exports = router;
