# This is my sandbox to play with Electron and Angular.
Nothing serious about it.

# angular-electron-boilerplate

This template provides a starting point of a modern and secure Electron app.


## Project goals

Use [Angular](https://angular.io/) for the Electron renderer process. Using a modern frontend framework helps you organize your codebase once your Electron app grows in complexity. Use the [Angular CLI](https://cli.angular.io/) to generate components, routes, services and pipes. To give a modern look-and-feel [Angular Material](https://material.angular.io/) is used. This can easily be removed if it is not needed.


Use [TypeScript](https://www.typescriptlang.org/) for strongly-typed JavaScript.
Use [webpack](https://webpack.js.org/) to pack *main* and *preload* to produce small fast build output. Everything is packed, so no need to include the */node_modules* folder, in order to remove unnessesary files and to produce small and fast builds.

Use most secure Electron security settings: contextIsolation and disabled nodeIntegration and disabled enableRemoteModule. preload uses the contextBridge.

## Dependencies

All packages are specified under *devDependencies* since, due to the webpack usage, no modules in the */node_modules* folders are needed for production.
You have to install ImageMagic in order to get things running.
## Getting started


```bash
$ git clone https://github.com/jbouduin/pictures
$ cd angular-electron-boilerplate
$ npm install
$ npm run build:dev:all
$ npm start
```


## NPM scripts

### Builds

This builds a project and places the output in the */dist* folder.

| Command | Description |
| --- | --- |
| `npm run build:dev:all` | Developer builds of all projects |
| `npm run build:prod:all` | Production builds of all projects |
| `npm run build:dev:main` | Developer build of the *Electron main* project |
| `npm run build:prod:main` | Production build of the *Electron main* project |
| `npm run build:dev:renderer` | Developer build of the *Electron renderer* project |
| `npm run build:prod:renderer` | Production build of the *Electron renderer* project |
| `npm run build:dev:preload` | Developer build of the *Electron preload* project |
| `npm run build:prod:preload` | Production build of the *Electron preload* project |

### Watch

Start watching for source code changes, and builds after each source code change.

| Command | Description |
| --- | --- |
| `npm run build:watch:all` | Watch all projects |
| `npm run build:watch:main` | Watch the *Electron main* project |
| `npm run build:watch:renderer` | Watch the *Electron renderer* project |
| `npm run build:watch:preload` | Watch the *Electron preload* project |

### Tests

Test commands.

| Command | Description |
| --- | --- |
| `npm run test:test` | Executes all Angular unit-tests |
| `npm run test:e2e` | Executes Angular end-2-end tests |
| `npm run test:lint` | Angular lint |

### Updates

Commands for updating NPM modules.

| Command | Description |
| --- | --- |
| `npm run update:angular` | Easy update to latest stable Angular |
| `npm run update:electron` | Easy update to latest stable Electron |
| `npm run update:webpack` | Easy update to latest stable WebPack |

### Packaging

| Command | Description |
| --- | --- |
| `npm run package` | Package current */dist* folder into an app in the */release-builds* folder |
| `npm run release` | First build a production build, then package */dist* folder into an app in the */release-builds* folder |


## Packaging into an app

This is where all the magic happens.

```bash
$ npm run release
```

Then your app will be put into the */release-builds* folder. Can build an app for Windows, macOS and Linux.
