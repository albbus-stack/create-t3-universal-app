#! /usr/bin/env node
import ora from "ora";
import chalk from "chalk";
import { exec } from "child_process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const args = process.argv.slice(2);
const withNativewind = args.includes("--with-nativewind");
const folderArg = args.filter((arg) => !arg.includes("--"))[0];

const repoUrl = "https://github.com/chen-rn/CUA";

console.log(
  "  _   ____    ___ _   _  _   \n" +
    " | |_|__ /   / __| | | |/_\\ \n" +
    " |  _||_ \\  | (__| |_| / _ \\\n" +
    "  \\__|___/   \\___|\\___/_/ \\_\\\n"
);

const setup = (folderName) => {
  const gitSpinner = ora(
    chalk.green.bold(`Cloning create-universal-app into ${folderName}`)
  ).start();

  exec(`git clone ${repoUrl} ${folderName}`, (err, stdout, stderr) => {
    if (err) {
      gitSpinner.fail();
      console.error(chalk.red(`Failed to clone repository: ${err}`));
      return;
    }

    gitSpinner.succeed();

    const yarnSetupSpinner = ora(chalk.green.bold(`Setting up yarn`)).start();

    exec(
      `cd ${folderName} && yarn set version stable && yarn config set nodeLinker node-modules`,
      (installErr, installStdout, installStderr) => {
        if (installErr) {
          yarnSetupSpinner.fail();
          console.error(chalk.red(`Failed to setup yarn: ${installErr}`));
          return;
        }

        yarnSetupSpinner.succeed();

        const installSpinner = ora(
          chalk.green.bold(`Installing dependencies`)
        ).start();

        exec(
          `cd ${folderName} && yarn install`,
          (installErr, installStdout, installStderr) => {
            if (installErr) {
              installSpinner.fail();
              console.error(
                chalk.red(`Failed to install dependencies: ${installErr}`)
              );
              return;
            }

            installSpinner.succeed();

            if (withNativewind) {
              console.log("This has to be yet a thing :(");
            }

            console.log(
              chalk.yellow(
                "\n🚧 Remember to set up your environment variables properly by:\n1. Duplicating the .env.example file, removing .example, and entering your variables.\n2. Entering your Clerk frontend api in ./packages/app/provider/auth/index.tsx.\n"
              )
            );

            console.log(
              chalk.green.bold(
                "🚀 Successfully created CUA project! After having filled out your .env, run 'yarn db-push' to create your database tables or 'yarn web' to start the web development server."
              )
            );

            rl.close();
          }
        );
      }
    );
  });
};

if (!folderArg) {
  console.log(chalk.green.bold("Enter the name of the project:"));

  rl.question("", (folderName) => {
    setup(folderName);
  });
} else {
  setup(folderArg);
}
