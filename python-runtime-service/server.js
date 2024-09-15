import express from "expres";
import exec from "child_process";
import path from "path";
import fs from "fs";
import { stdout } from "process";

// Express app initilization
const app = express();
const port = 8082;

// 1. Gather the Code
// 2. Save Code to Temporary File
// 3. Execute this file Code.
// 4. Send Response as Output to WorkerNode

app.post("/execute", (req, res) => {
  // Gather the Data

  const { code, language } = req.body;

  // Saving to Temporary file
  const codeFile = path.join(__dirname, "temp.py");
  fs.writeFileSync(codeFile, code);

  // Compiling the File Code
  exec(`python3 temp.py`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Error while Compiling (Python Service)",
        output: stderr,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Code Compiled Successfully",
        output: stdout,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Python Runtime Microservice run on port ${port}`);
});
