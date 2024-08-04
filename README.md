# SQLFluff Node

## Local Development

- prerequisites: have [pnpm](https://pnpm.io/) installed.
- run with node 20 or above in the shell (use [nvm](https://github.com/nvm-sh/nvm) to manage node versions)

1. Run `pnpm install` to install dependencies.

Optionally:
    - Lint and format using `pnpm run lint` and `pnpm run format` respectively.


## To publish the package

1. Login to NPM using pnpm login
2. Update the version in `package.json` (pnpm version patch also works)
3. Update the package.json file as required: version, links, author, description, license, etc.
4. Update the README.md file as required.
5. Run `pnpm publish`.

Its suggested to start with a version that includes `@alpha` or `@beta` to indicate that the package is not stable yet and allow some testing.