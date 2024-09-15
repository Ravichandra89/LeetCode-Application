import express from "express";
import fs from fs;
import exex from "child_process";
import path from path;
import {v4 as uuidv4} from "uuid";

// Express initilization
const app = express();
const port = 8081;

// 1. Gather the Code
// 2. Save Code to temporary file
// 3. Execute this file Code.
// 4. Send Response as Output to WorkerNode
// 5. Delete Temporary File

app.post('/execute',async (req, res) => {
    // Gather Data
    const { code, language } = await req.body;

    // Saving to Temporary file Code
    const codeFile = path.join(__dirname, "Main.java");
    fs.writeFileSync(codeFile, code);

    // Compile the Code
    await exec(`javac Main.java && java Main`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({
                success : false,
                output: stderr,
            });
        } else {
            res.json({
                success : true,
                message : "Code Compiled Success fully",
                output : stdout,
            }, {status : 200});
        }
    })
})

// Listen the Server

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})