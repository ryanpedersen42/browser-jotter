### About

Monorepo for a CLI tool in npm ([link](https://www.npmjs.com/package/browser-jotter))

It uses [lerna](https://lerna.js.org/) to manage packages and deploy to npm.

### Using the CLI tool

```

// base command to provision notebook.js in current directory, accessible on port 4005
npx browser-jotter serve 

// optional flags
npx browser-jotter serve <name of file> -p <port to run on>

// help
npx browser-jotter -h

```


