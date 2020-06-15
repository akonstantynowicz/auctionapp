require("../node_modules/dotenv").config();

const express = require("express");
const passport = require("./passport/index");
const cookieParser = require("cookie-parser");
const passportSocketIo = require("passport.socketio");

const port = process.env.PORT || 3000;
const secret = process.env.SECRET || "$uper $ecret";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(secret));

const expressSession = require("express-session");
const mongoose = require("./mongoose");
const MongoStore = require("connect-mongo")(expressSession);
const store = new MongoStore({
    mongooseConnection: mongoose.connection
})

app.use(expressSession({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.use(passport.initialize());
app.use(passport.session());

const routes = require("./routes");
app.use("/api", routes);

if(process.env.NODE_ENV === "production") {
    console.log("production");
    
    app.use(express.static(__dirname + "/public"));
    app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

app.use((req, res) => {
    res.status(404).json({
        error: `Niepoprawne żądanie: ${req.method} ${req.originalUrl}`
    });
});

//const server = require("./https")(app);
const server = require("http").createServer(app);

const socketio = require("socket.io")(server)
require("./sockets/index")(socketio);

socketio.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    secret: secret,
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  }));

function onAuthorizeSuccess (data, accept) {
    console.log('successful connection to socket.io');
    accept(null, true);
  }

function onAuthorizeFail(data, message, error, accept){
    if(error)
      throw new Error(message);
    console.log('failed connection to socket.io:', message);
    accept(null, false);
}

server.listen(port, "0.0.0.0", () => {
    console.log(`Serwis aukcyjny dostępny na porcie ${port}`);
});
