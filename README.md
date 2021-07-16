openLAMA is an open source platform which has been developed by the
Swiss Kanton Basel Landschaft, with the goal of automating and managing
large scale Covid testing programs or any other pandemic/viral infections.

Copyright(C) 2021 Kanton Basel Landschaft, Switzerland
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.
See LICENSE.md in the project root for license information.
You should have received a copy of the GNU Affero General Public License
along with this program. If not, see https://www.gnu.org/licenses/.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Environment variables

.env.develop
.env.staging
.env.production

These files contain global variables that are used throughout the application.

When running the command `npm run start` to run the project locally, the system is using the .env.develop file.

When running the command `npm run build:stating` to build the project for a staging environment the .env.staging is used.

When running the command `npm run build` to build the project for production, the .env.production is used.

Variable REACT_APP_API_ENDPOINT_URL contains the base url used in axios to connect to the .NET API endpoints.

Variable REACT_APP_DEFAULT_SUPPORT_PERSON_EMAIL contains the email for the support person

Variable REACT_APP_CC_RECEIVER contains the email for the CC emails.

You will see that the REACT_APP_API_ENDPOINT_URL in the .env.development file is a localhost url. This is because the .NET API does not run on the same domain as the front end. In order to get no CORS errors, a proxy server is needed.

The package i'm using is this [local-cors-proxy](https://www.npmjs.com/package/local-cors-proxy).

The command to start the proxy is this

### `lcp --proxyUrl https://fastly-api-dev.primeholding.com`

### Deployment

For production the project is build locally using the "Run build" command and then the "build" folder is zip.
TODO finish this.

For the staging, we are using the company's jenkins server, which is proprietary, please ask for the Devops documentation for more details.

### Project structure.

.vscode - vscode configurations
nginx - nginx config.
public - static files like the main index.html, favicons and translations.
src - main code.
... other configuration files.

### `src folder`

apiService - contains an Axios instance.

assets - logos and other images that are used dynamically in code.

components - main components

config - contains the routes config that is used to automatically map each route using metadata.

formValidation - contains functions that are used in the `FormControllerInputs` components for the React Hook Form library.

pages - contains pages that are separated by the roles.

redux - Redux library to store and maintain the global state.

styles - global scss.

translation - contains the instance of the translations library.

utils - contains various files for functions that are called in multiple places and enums.

### `How the project works`

Everything starts from the main index.tsx file. There will be found the Material UI Theme provider, a global Suspense loader, the Provider for Redux, a global Error boundary component, Persistor, Translator, Snackbar and the App.

In the App.tsx there is the Router, Snackbar viewer component, MainDataLoadingContainerWrapper to load any initial data before the main render.
Router switch handles the Auth and UnAuth Pages.
This is also the place where we set the default language for the web application, in this case German.

AuthenticatedRoute is used to map the routes based on the user role after we login. Here we specify the path, the authKey which is used to check against the logged in users role and the component to load in. The component contains the main internal routes for that role.

UnauthenticatedRoute handles all routes that don't require the user to be logged in.

The MainDataLoadingContainerWrapper component downloads some global data from the API that is not constantly updated.
It fetches all Cities and Organization Types that are used throughout the application.
If this fails to fetch them it won't load the rest of the application but will show an error message instead.

There are 5 roles.
Lab - The laboratory
Logistics - not used - currently it has the initial PoC of Temis AI on it.
Onboarding and training - The university
Organization - each organization.
Unathenticated - login, registering, email validation and other.

Each "role" has a main index file that contains the Navbar component if we want to have something custom for each role.
NavDrawer which is the main navigation component, unique for each role.
And the main RouterMapping controller which maps/creates automatically each route based on the "routes" config file mentioned above.

Example of how a page works. Using "LabAdministrationEditDay".

Using the "useParams()" we get the params from the url and dispatch (getLaboratoryAdministrationEditDayData) a fetch function to get the data necessary to view and edit.
Dispatch call a Thunk middleware, we call the "getDayDataRequesting" function to set the correct flags before the API call is made.
We call the API endpoint using "getLaboratoryAdministrationEditDayDataAPI". This function called our HttpClient object which contains the axios instance. The axios instance is using a config to add the base url depending on the environment. This instance also handles the error validation and parsing of messages in order to be shown on the UI.
On response we return the response to the "getDayDataSuccess" function which saves the data in state and adjust the flags.
On error we return the ErrorObject and pass it to the Error function if we expect to have dynamic error translations, if not we just call a default error message function "extractErrorMessage".

It's a MUST to have all 3 functions in the Thunk middleware.
"Requesting", "Success", "Error".

Inside the redux folder, we have a global auth and authData states that handle login in/out, saving state and persisting it inside the browser storage.

We have a global folder for states that are used in different roles. For example, "supportPerson" is used in every profile view/edit on all roles.

snackbar state controls the snackbar messages like Success, Information, Warning and Error.
