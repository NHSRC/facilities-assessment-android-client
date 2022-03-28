### For running the app in an enumator
- Install Android sdk (please check the AndroidManifest.xml for the versions).
- Install make utility
- Install node version (check .nvmrc file in the source code)
- Run `make deps` to install node dependencies
- There are several server configurations in which you can run the android app in the enulator. e.g. the server can be local, in production, or somewhere else in the LAN. The makefile commands create these configurations. Use `make run-app-android-nhsrc-dev` to connect the app to a local server. When the make command is run a Config file is created in `src/js/framework/Config.js`. Please see below about the Config file.

### Config file
The Config.js file has two lines as follows.
`import config from "../../../config/env/nhsrc.json";
export default config;`

Essentially it imports a file specific to any environment.

### Setting up config file for development environment
- Create a copy of Config.js.example into Config.js file (in the same dir where Config.js.example is)
- Modify the localhost.json as per your needs.
- Leave all the config parameters to default except SERVER_URL which should point to where your Gunak server is running.
