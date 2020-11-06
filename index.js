#! /usr/bin/env node

const { spawn } = require("child_process");
const inquirer = require("inquirer");
const path = require("path");
const configFiles = ["nodejs", "nodejs-babel", "nodejs-typescript"];
const packageManager = ["npm", "yarn"];

const nodeExpressRepoURL =
  "https://github.com/Jayvirrathi/node-express-api-starter.git";
const nodeExpressBabelRepoURL =
  "https://github.com/Jayvirrathi/node-express-es6-api-starter.git";
const nodeExpressTypeScriptRepoURL =
  "https://github.com/Jayvirrathi/node-express-typescript-api-starter.git";

let repoURL;

(async () => {
  const { framework } = await inquirer.prompt([
    {
      type: "list",
      message: "Pick the framework you're using:",
      name: "framework",
      choices: configFiles,
    },
  ]);

  console.log(framework);

  if (framework === "nodejs") {
    repoURL = nodeExpressRepoURL;
  } else if (framework === "nodejs-babel") {
    repoURL = nodeExpressBabelRepoURL;
  } else if (framework === "nodejs-typescript") {
    repoURL = nodeExpressTypeScriptRepoURL;
  } else {
    repoURL = nodeExpressRepoURL;
  }

  const { name } = await inquirer.prompt([
    {
      type: "input",
      message: "Pick the name:",
      name: "name",
      validate: function (name) {
        let valid = !(name == "");
        return valid || `Please enter a valid name`;
      },
    },
  ]);

  const { tool } = await inquirer.prompt([
    {
      type: "list",
      choices: packageManager,
      message: "Pick the package manager:",
      name: "tool",
    },
  ]);

  runCommand("git", ["clone", repoURL, name])
    .then(() => {
      return runCommand("rm", ["-rf", `${name}/.git`]);
    })
    .then(() => {
      console.log("Installing dependencies...");
      return runCommand(tool == "yarn" ? "yarn.cmd" : "npm.cmd", ["install"], {
        cwd: process.cwd() + "/" + name,
      });
    })
    .then(() => {
      console.log("Done! 🏁");
      console.log("");
      console.log("To get started:");
      console.log("cd", name);
      console.log(tool == "yarn" ? "yarn dev" : "npm run dev");
    });

  function runCommand(command, args, options = undefined) {
    const spawned = spawn(command, args, options);

    return new Promise((resolve) => {
      spawned.stdout.on("data", (data) => {
        console.log(data.toString());
      });

      spawned.stderr.on("data", (data) => {
        console.error(data.toString());
      });

      spawned.on("close", () => {
        resolve();
      });
    });
  }
})();
