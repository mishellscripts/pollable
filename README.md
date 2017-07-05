# Pollable


## Overview

Pollable is a fullstack JavaScript application where users can create own polls to share or contribute to other polls by voicing their own opinions. Pollable utilizes the ExpressJS web framework, MongoDB, and Node.js. Github authentication is used for security and login purposes and is accomplished by using [Passport](http://passportjs.org/). Pollable is built from a JavaScript boilerplate namely [Clementine](http://www.clementinejs.com/) for ease of development as the creator of this voting application is new to full stack JavaScript :)

Demo: Heroku deployment coming soon.


## Quick Start Guide

If the demo link is not working and you would like to view the application, follow these steps. If you have everything in the next section installed, skip ahead to Installation & Startup. 

### Prerequisites

You will need the following installed in order to proceed.

- [Node.js](https://nodejs.org/)
- [NPM](https://nodejs.org/)
- [MongoDB](http://www.mongodb.org/)
- [Git](https://git-scm.com/)

### Installation & Startup

Go to your preferred directory and enter the below in the terminal window:

```bash
$ git clone https://github.com/mishellscripts/pollable.git
```

Next, install the dependencies:

```
$ cd your-project
$ npm install
```


### Setup GitHub Authentication

Please follow [this guide](http://www.clementinejs.com/tutorials/tutorial-passport.html#GitHubAppSetup) to register the application with GitHub and get API keys / secrets.

### Setup MongoDB

Coming soon. For now, I highly recommend using [mLab](https://mlab.com/) to host your MongoDB. It's free for 500MB and enough for your testing purposes.

### Local Environment Variables

Create a file named `.env` in the root directory. This file should contain:

```
GITHUB_KEY=your-client-id-here
GITHUB_SECRET=your-client-secret-here
MONGO_URI=your-monogdb-uri-here
PORT=8080
APP_URL=http://localhost:8080/
```

### Ready to Go

Ensure that you have connection to your MongoDB database. Connect to your database by typing the following in the terminal:

```bash
$ ./mongod
```

To start the app, make sure you're in the project directory and type `node server.js` into the terminal. This will start the Node server.

You should the following messages within the terminal window:

```
Node.js listening on port 8080...
```

Next, open your browser and enter `http://localhost:8080/`. Congrats, you're up and running!


## License

MIT License. [Click here for more information.](LICENSE.md)
