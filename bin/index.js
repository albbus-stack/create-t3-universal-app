#! /usr/bin/env node
import ora from "ora";
import chalk from "chalk";
import { exec } from "child_process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const repoUrl = "https://github.com/chen-rn/CUA";

const args = process.argv.slice(2);
const folderArg = args.filter((arg) => !arg.includes("--"))[0];

const withSupabase = args.includes("--with-supabase");
let repoBranch = "";
if (withSupabase) {
  repoBranch = "-b supabase --single-branch";
}

const withNativewind = args.includes("--with-nativewind");
if (withNativewind) {
  console.log(
    chalk.red.bold("The Nativewind implementation has yet to be a thing :(")
  );
}

console.log(
  "  _   ____    ___ _   _  _   \n" +
    " | |_|__ /   / __| | | |/_\\ \n" +
    " |  _||_ \\  | (__| |_| / _ \\\n" +
    "  \\__|___/   \\___|\\___/_/ \\_\\\n"
);

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

const setup = (folderName) => {
  const gitSpinner = ora(
    chalk.green.bold(`Cloning create-universal-app into ${folderName}`)
  ).start();

  exec(`git clone ${repoBranch} ${repoUrl} ${folderName}`, (gitErr) => {
    if (gitErr) {
      gitSpinner.fail();
      console.error(
        chalk.red.bold(`Failed to clone repository: ${gitErr.message}`)
      );
      return;
    }

    gitSpinner.succeed();

    const installSpinner = ora(
      chalk.green.bold(`Installing dependencies`)
    ).start();

    exec(`cd ${folderName} && yarn install`, (installErr) => {
      if (installErr) {
        installSpinner.fail();
        console.error(
          chalk.red.bold(
            `Failed to install dependencies: ${installErr.message}`
          )
        );
        return;
      }

      installSpinner.succeed();

      const prismaSpinner = ora(
        chalk.green.bold(`Generating prisma client`)
      ).start();

      exec(`cd ${folderName} && yarn generate`, (prismaErr) => {
        if (prismaErr) {
          prismaSpinner.fail();
          console.error(
            chalk.red.bold(
              `Failed to generate prisma client: ${prismaErr.message}`
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

        rl.close();
      });
    });
  });
};
