import express from "express";
import multer from "multer";

import * as bodyParser from "body-parser";

import { isCorrectFormat } from "./middlewares/checkFile";
import { generateReports } from "./functions/reports";

import { addTest } from "./middlewares/tests";

const app = express();
const port = 8080;
var upload = multer({ dest: "csv/" });

app.use(bodyParser.json());

app.post(
  "/api/csv",
  upload.array("photos", 2),
  isCorrectFormat,
  generateReports
);

app.get("/test", addTest, isCorrectFormat);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
