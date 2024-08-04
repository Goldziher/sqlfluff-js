# SQLFluff Node

## Local Development

- run with node 20 or above in the shell (use [nvm](https://github.com/nvm-sh/nvm) to manage node versions)

1. Run `npm install` to install dependencies.

Optionally:
    - Lint and format using `npm run lint` and `npm run format` respectively.

2. Install the CLI globally with
```bash
    npm install -g .
```

This will expose the command `sqlfluffjs`  in the shell. The name of the command is set in [package.json](./package.json) under the `bin` key.

## To publish the package

1. Login to NPM using `npm login`
2. Update the version in `package.json` (`npm version patch` etc. also work)
3. Update the package.json file as required: version, links, author, description, license, etc.
4. Update the README.md file as required.
5. Update the name of the command in the `bin` key in `package.json` if required.
6. Run `npm publish`.

Its suggested to start with a version that includes `@alpha` or `@beta` to indicate that the package is not stable yet and allow some testing.