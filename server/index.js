const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const { chatToken, videoToken } = require('./tokens');
const {getToken} = require("./getToken");
const {getLambdaToken} = require('./getLambdaToken');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt()
    })
  );
};


app.get('/getToken', (req,res)=>{
    const lambdaToken = getToken();
    lambdaToken.then(function(result){
      console.log("ui" + result);
      res.send(result);
    })
    
});

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/chat/token', (req, res) => {
  const identity = req.query.identity;
  const token = chatToken(identity, config);
  sendTokenResponse(token, res);
});

app.post('/chat/token', async (req, res) => {
  const identity = req.body.identity;
  var token = await getLambdaToken(identity);
  token.identity = identity;
  token = JSON.parse(token);
  res.send(
    JSON.stringify({
      token : token.tokenJWT
    })
  );

  //sendTokenResponse(token, res);
});

app.get('/video/token', (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.post('/video/token', (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.listen(4201, () =>
  console.log('Express server is running on localhost:4201')
);
