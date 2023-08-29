# create-t3-universal-app

![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![npm](https://img.shields.io/npm/dw/create-t3-universal-app?color=red&label=npm&labelColor=black&logo=npm&logoColor=red&style=flat-square)

<p align="center">
  <b>⚠&nbsp; This repo has been moved under the <a href="https://github.com/timothymiller/t4-app/tree/main/apps/cli">t4-app</a> monorepo &nbsp;⚠</b>
</p>

This is a npx cli tool to create a cross-platform universal app using the [CUA](
<https://github.com/chen-rn/CUA>) (create-universal-app) template.

This is currently live on npm [here](<https://www.npmjs.com/package/create-t3-universal-app>), there is no need for you to clone this repo.

## Usage

```bash
npx create-t3-universal-app <project-name> [--flags]
```

If you don't pass any project name a prompt will show up asking for one. This is up to date with the latest version of CUA using Expo Router.

You can pass one of the following flags to choose a template:

- `--with-supabase` clones the [Supabase version](<https://github.com/chen-rn/CUA/tree/supabase>).

- `--with-drizzle-pg` clones the [Drizzle Postgres version](<https://github.com/chen-rn/CUA/tree/drizzle-pg>).

- `--with-drizzle-sql` clones the [Drizzle Sqlite version](<https://github.com/chen-rn/CUA/tree/drizzle-sql>).
