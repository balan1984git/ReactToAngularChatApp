var request = require("request");

var getLambdaToken = function(identity) {

    var options = {
        'method': 'POST',
        //'url': 'https://tib17m6o30.execute-api.us-east-1.amazonaws.com/dev/gettoken',
        'url':'https://50dil18a5f.execute-api.us-east-1.amazonaws.com/dev/token',
        'headers': {
        },
        body: JSON.stringify({"body":"{\"identity\":\""+identity+"\"}"})
    };
    return new Promise(function(resolve, reject){
            request(options, function (error, response) {
                if (error){
                    reject(error);
                } else {
                   // console.log("lambda response" + response.body);
                    resolve(response.body);
                }
            });
    });

}

module.exports = {getLambdaToken}