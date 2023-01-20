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
const withExpoRouter = args.includes("--with-expo-router");
const folderArg = args.filter((arg) => !arg.includes("--"))[0];

let repoUrl = "https://github.com/chen-rn/CUA";
if (withExpoRouter) {
  repoUrl = "https://github.com/chen-rn/CUA/tree/expo-router";
}

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

  exec(`git clone ${repoUrl} ${folderName}`, (gitErr, gitStdout, gitStderr) => {
    if (gitErr) {
      gitSpinner.fail();
      console.error(chalk.red.bold(`Failed to clone repository: ${gitErr}`));
      return;
    }

    gitSpinner.succeed();

    const yarnSetupSpinner = ora(chalk.green.bold(`Setting up yarn`)).start();

    exec(
      `cd ${folderName} && yarn set version stable && yarn config set nodeLinker node-modules`,
      (setupErr, setupStdout, setupStderr) => {
        if (setupErr) {
          yarnSetupSpinner.fail();
          console.error(chalk.red.bold(`Failed to setup yarn: ${setupErr}`));
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
                chalk.red.bold(`Failed to install dependencies: ${installErr}`)
              );
              return;
            }

            installSpinner.succeed();

            const prismaSpinner = ora(
              chalk.green.bold(`Generating prisma client`)
            ).start();

            exec(
              `cd ${folderName} && yarn generate`,
              (prismaErr, prismaStdout, prismaStderr) => {
                if (prismaErr) {
                  prismaSpinner.fail();
                  console.error(
                    chalk.red.bold(
                      `Failed to generate prisma client: ${prismaErr}`
                    )
                  );
                  return;
                }

                prismaSpinner.succeed();

                console.log(
                  chalk.yellow(
                    "\n🚧 Remember to set up your environment variables properly by:\n1. Duplicating the .env.example file, removing .example, and entering your variables\n2. Entering your Clerk frontend api in /packages/app/provider/auth/index.tsx\n"
                  )
                );

                console.log(
                  chalk.green.bold(
                    "🚀 Successfully created CUA project! After having filled out your .env, run 'yarn db-push' to create your database tables or 'yarn web' to start the web development server."
                  )
                );

                return;
              }
            );
          }
        );
      }
    );
  });
};

if (withNativewind) {
  console.log(
    chalk.red.bold("The Nativewind implementation has yet to be a thing :(")
  );
} else {
  if (!folderArg) {
    console.log(chalk.green.bold("Enter the name of the project:"));

    rl.question("> ", (folderName) => {
      if (folderName === "" || folderName.includes(" ")) {
        console.log(chalk.red.bold("Please enter a valid folder name!"));
      } else {
        console.log(" ");
        setup(folderName);
      }
      rl.close();
    });
  } else {
    setup(folderArg);
  }
}
