var request = require('request');

var getToken = function(identity) {   

    const accountSid =  process.env.TWILIO_ACCOUNT_SID;
    const authToken  =  process.env.TWILIO_AUTH_TOKEN;
    const apiKey     =  process.env.TWILIO_API_KEY;
    const apiSecret  =  process.env.TWILIO_API_SECRET;
    const chatService = process.env.TWILIO_CHAT_SERVICE_SID;

    const twilio = require('twilio')(accountSid, authToken); 
    const AccessToken = require('twilio').jwt.AccessToken;
    const ChatGrant = AccessToken.ChatGrant;
    
    const accessToken = new AccessToken(accountSid, apiKey, apiSecret);
    accessToken.identity = identity;

    const chatGrant = new ChatGrant({
        serviceSid: chatService
    });
    
    accessToken.addGrant(chatGrant);

    return { 
        token: accessToken,
        tokenJWT: accessToken.toJwt()
   };
}

module.exports = { getToken };