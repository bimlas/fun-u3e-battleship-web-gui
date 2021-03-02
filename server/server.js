const http = require('http');
const ws = require('ws');
const url = require('url');
const game = require('./games/snake');

game.initGame();

const httpServer = http.createServer(function (req, resp) {
  const
    requestedUrl = req.url,
    requestedPath = url.parse(requestedUrl, true, false).pathname;

  console.log(`${(new Date()).toISOString()} ${req.method} "${requestedPath}"`);

  respond('/',
    () => {
      answerWithJSON(game.getBoard());
    },
    (postDataObject) => {
      game.playerAction(postDataObject.playerName, postDataObject.action);
      answerWithJSON(game.getBoard());
    }
  );

  function answerWithJSON(answer) {
    resp.end(JSON.stringify(answer));
  }

  function respond(path, getHandler, postHandler) {
    if (requestedPath !== path) return;

    /*
    Set Access-Control-Allow-Origin http header will fix
    "No 'Access-Control-Allow-Origin' header is present on the requested resource"
    error (CORS policy) when use XMLHttpRequest object to get this server
    page via ajax method.
    */
    resp.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });

    if ((req.method === 'GET') && getHandler) {
      getHandler();
    }
    if ((req.method === 'POST') && postHandler) {
      passPostData(postHandler);
    }
  }

  function passPostData(callback) {
    let postData = '';

    req.on('data', function (chunk) {
      postData += chunk;
    });

    req.on('end', function () {
      console.log("Client post data: " + postData);
      const postDataObject = JSON.parse(postData);
      return callback(postDataObject);
    })
  }
});

const wsServer = new ws.Server({
  server: httpServer
});

wsServer.on('connection', function (connection) {
  connection.send('Welcome!');

  connection.on('message', function (message) {
    console.log(`${(new Date()).toISOString()} WEBSOCKET ${message}`);
  });
});

httpServer.listen(8888);
console.log("Server is started.");
