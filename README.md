# Barber Shop

Demo is available [here](https://barber-shop-53333.web.app/) 

Admin credentials: 
- username:demo@demo.com 
- password: demo2020

Reservations system made with Vue + Firebase ecosystem (cloud functions, auth, firestore, hosting). This example is inspired in a barber shop requirements, but is applicable in a lot of scenarios. 

User can make a reservation getting a code. This code could be used to cancel the reservation.

You can deploy a reservation system without a server, but keep in mind this is just a playground.

Comments and contributions will be appreciated. I'm doing it just for fun.

## Project setup

Clone this repository

```sh
$ git clone https://github.com/ibonkonesa/barber-shop.git
```

You must create a new Firebase project. Cloud Firestore location must be set to us-central (default). If you choose other location, you must update src/store/user/location variable. Go to database section and create a new cloud firestore database. 


This repo have two legs: Cloud functions (act as a backend server, providing authentication and triggering when bookings are written) and a Vue.JS SPA that allow users to make and check reservations.

Cloud functions code is located at cloud-functions folder. In the root of this folder there is a file you have to edit. 

Rename .firebaserc.example to .firebaserc and update projects.default value with your Firebase Project id. You can see it on Project Configuration in the Firebase console.

Public folder is a symbolic link to the dist folder. This folder ("public") will be published when you deploy your Firebase project (this feature is called "Hosting". When you create a Firebase project you get some hosting space. You can link your domain with this hosting. Later I explain it better.).

Functions folder contains two important files:

-index: here is where server code is. You are free to update / get better this code. Basically, there are 3 functions:

  * createBooking. Is a trigger launched when a reservation is created in the database. This function will notify if you configure mailing.
  * createToken. This is a http function. It returns a token used by the webapp in order to modify a reservation
  
-serviceAccountKey.json: If you clone this repo this file shouldn't exists. It's the server side (remember, cloud function act as a server) configuration file. 
You have to create a new service account from Firebase console. Go to Settings> Service account and generate a new private account. Put the generated file in cloud-functions/functions/serviceAccountKey.json

After setting up cloud functions, you have to configure the front end App. Vue.JS project is located on src folder. There is a file called config/firebase.js.example. Please rename this file to firebase.js and update the config variable with data provided adding a new web application in Firebase project's console. Just update config variable. 

Schedule and app config (title, description) are defined in config folder. Constant names are self-descriptive ;)

Admin users must be created in Firebase Console, and they have to be created using Email/Password signing method. All users created with this method will be able to this area.

Now you can deploy this project.

## Mailing

You can set up automatic email sending when a client makes a reservation. 

Just rename /cloud-functions/functions/mailing.example
to /cloud-functions/functions/mailing.js and put gmail sender credentials, and the receiver email.
Remember to activate "Gmail less secure apps" (https://myaccount.google.com/lesssecureapps). 
If you are using 2FA in your sender email, you would have to create an Application Specific password in order to get mailer working. This [link](https://community.nodemailer.com/using-gmail/) could be useful. 

## Development

### With Docker

Just apply the included docker-compose file and go to http://localhost:8080

```sh
$ docker-compose up
```

### Locally

Npm:

```sh
$ npm install
$ npm run serve
```

Yarn:

```sh
$ yarn install
$ yarn serve
```

Hot-reload server will be available at  http://localhost:8080

## Deploy app

After setting up the project, you can deploy the project. 

### App

This is a vue-cli based project. Install npm packages:

```sh
$ npm install
```

Launch build command:

```sh
$ npm run build --prod
```



### Cloud functions and hosting

Cloud functions (triggers and http) must be published. You will need firebase-tools package. Install it:

```sh
$ npm install -g firebase-tools
```

Enter to cloud-function folder:

```sh
$ cd cloud-functions
```


Enter functions folder and install npm packages:

```sh
$ cd functions
$ npm install
$ cd ..
```

The frontend app will be built at /dist folder. Please check if there is a symbolic link in cloud-functions/public pointing to /dist folder. If this link does not exist, execute:

```sh
$ ln -s ../dist public
```


Login to firebase. Firebase (Google) console credential will be required:

```sh
$ firebase login
```

Once you are logged in you can deploy functions and hosting:

```sh
$ firebase deploy 
```

A url will be printed in the terminal and reservation system will be accessible. You can link a custom domain in the Firebase console.

## ToDo

- Mobile app (Quasar? Ionic?)
- Refactor stores with async/await

   
## CONTRIBUTION

Comments and improvements will be appreciated.

## LICENSE

This repo can be cloned, forked, improved without referencing. If you like it and you want me to continue developing you can give me a star this repo :)
