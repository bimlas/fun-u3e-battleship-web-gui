const http = require('http');
const url = require('url');

const httpServer = http.createServer(function (req, resp) {
  const
    requestedUrl = req.url,
    requestedPath = url.parse(requestedUrl, true, false).pathname;

  console.log(`${(new Date()).toISOString()} ${req.method} "${requestedPath}"`);

  /*
  Set Access-Control-Allow-Origin http header will fix
  "No 'Access-Control-Allow-Origin' header is present on the requested resource"
  error (CORS policy) when use XMLHttpRequest object to get this server
  page via ajax method.
  */
  resp.writeHead(200, {'Access-Control-Allow-Origin': '*'});

  if (requestedPath === '/boards') {
    if (req.method === 'GET') {
      // Send response
      // TODO: Initiate the proper game
      resp.end(JSON.stringify({
        width: 10,
        height: 10,
      }));
    }
  }

  if (requestedPath === '/action') {
    if (req.method === 'POST') {
      let postData = '';

      req.on('data', function (chunk) {
        postData += chunk;
      });

      req.on('end', function () {
        const postDataObject = JSON.parse(postData);
        console.log("Client post data: " + postData);

        // // Handle POST data
        // if (postDataObject.init) {
        //   // Send response
        //   resp.end(JSON.stringify({width: 10, height: 10}));
        // }
      })
    }
  }
});

httpServer.listen(8888);
console.log("Server is started.");