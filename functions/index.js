// index.js  – Firebase Cloud Function wrapper for cors-anywhere
const functions = require('firebase-functions');
const cors_proxy = require('./lib/cors-anywhere');

function parseEnvList(env) {
  return env ? env.split(',') : [];
}

const originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
//put whitelist of available sites as string with comma separated urls
const originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
const checkRateLimit = require('./lib/rate-limit')(
  process.env.CORSANYWHERE_RATELIMIT
);

/* ------------------------------------------------------------------ */
/* create the proxy exactly as before                             */
const proxy = cors_proxy.createServer({
  originBlacklist,
  originWhitelist,
  requireHeader : ['origin', 'x-requested-with'],
  checkRateLimit,
  removeHeaders : ['cookie', 'cookie2'],
  redirectSameOrigin: true,
  httpProxyOptions : { xfwd: false },
});

/* ------------------------------------------------------------------ */
/* helper: if Firebase has already parsed the stream,             */
/* replay the original bytes into the outgoing proxyReq           */
function restoreBody(req) {
  if (req.rawBody && req.rawBody.length) {       // untouched buffer provided by Firebase
    proxy.once('proxyReq', proxyReq => {
      proxyReq.setHeader('content-length', req.rawBody.length);
      proxyReq.write(req.rawBody);               // push the bytes downstream
    });
  }
}

/* ------------------------------------------------------------------ */
/* exported HTTPS function                                        */
exports.corsProxy = functions.https.onRequest((req, res) => {
  restoreBody(req);                 // critical line to restore Body of PUT,POST request
  proxy.emit('request', req, res);  // hand off to cors-anywhere
});
