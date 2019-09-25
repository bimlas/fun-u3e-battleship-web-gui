const http = require('http');
const url = require('url');
const game = require('./games/snake');

game.initGame();

const httpServer = http.createServer(function (req, resp) {
  const
    requestedUrl = req.url,
    requestedPath = url.parse(requestedUrl, true, false).pathname;

  console.log(`${(new Date()).toISOString()} ${req.method} "${requestedPath}"`);

  respond('/snake',
    () => {
      game.nextTick();
      return JSON.stringify(game.getBoard());
    },
    (postDataObject) => {
      game.playerAction(postDataObject.playerName, postDataObject.action);
      return JSON.stringify(game.getBoard());
    }
  );

  function respond(path, getHandler, postHandler) {
    /*
    Set Access-Control-Allow-Origin http header will fix
    "No 'Access-Control-Allow-Origin' header is present on the requested resource"
    error (CORS policy) when use XMLHttpRequest object to get this server
    page via ajax method.
    */
    resp.writeHead(200, {'Access-Control-Allow-Origin': '*'});

    if (requestedPath !== path) return;

    if ((req.method === 'GET') && getHandler) {
      resp.end(getHandler());
    }
    if ((req.method === 'POST') && postHandler) {
      resp.end(passPostData(postHandler));
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

httpServer.listen(8888);
console.log("Server is started.");