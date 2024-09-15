import express from "express";
import exec from "child_process";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { stdout } from "process";

const app = express();
const port = 8000;

// 1. Gather the Code
// 2. Save Code to temprory file
// 3. Execute this file Code.
// 4. Send Response as Output to workerNode

app.post("/execute", (req, res) => {
  // Gather data
  const { code, language } = req.body;

  // Saving to Temprary File

  const codeFile = path.join(__dirname, "temp.cpp");
  fs.writeFile(codeFile, code);

  // Compiling the File Code
  exec(`g++ -o output temp.cpp && ./output`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json(
        {
          success: false,
          output: stderr,
        },
        { status: 400 }
      );
    } else {
      // Send the Output back to the Worker Node
      res.json({
        success: true,
        output: stdout,
      }, {status : 200});
    }
  });
});

// Listen the Server
app.listen(port, () => {
    console.log(`C++ Runtime Microservice run on port ${port}`);
})

