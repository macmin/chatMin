var espress = require('express');
var bodyParser = require('body-parser');
var request = require('request');

const APP_TOKEN = 'EAAHKonA8xtsBABJZAfZALHw4c7XW4m5b4ZBQE4Clk4ADgqCAAJ0di9xZAHQ9ZBZBC79VnEo9ZCDaKy2QlLPdCr72rj7GGIPAA8Tj18gCLCkF1PnX5f53hzSt6oa5Q4FfsutDukzKbcK1PuAicfDHeadH9FOdN97ZCwJrEmzcPm1rnUoKKDL3WuTU';

var app = espress();
app.use(bodyParser.json() );

app.listen(3000,function(){
	console.log("El servidor se encuentra en el puerto 3000");
});

app.get('/', function(req,res){
	res.send('Bienvenido a mi servidor');
	
});

app.get('/webhook', function(req,res){

	if(req.query['hub.verify_token'] === 'tes_token_hello_mac'){

		res.send(req.query['hub.challenge']);
	}else{
		res.send('No estas autorizado');
	}
	
});

app.post('/webhook', function(req,res){

	var data = req.body;

	if(data.object == 'page'){

		data.entry.forEach(function(pageEntry){
 		
 			pageEntry.messaging.forEach(function (messagingEvent){

 				if(messagingEvent.message){
 				receiveMessage(messagingEvent);
 			}

 			});

		});
		res.sendStatus(200);
	
	}

});


function receiveMessage(event){
	
	var senderId = event.sender.id;
	var messageText = event.message.text;

	console.log(senderId);
	console.log(messageText);

    evaluateMessage(senderId,messageText);

}

function evaluateMessage(recipientId,message){

	var finalMessage = '';

	if(isContain(message, 'Hola')){
    	
    	finalMessage = 'Hola, ¿Como estas? ';
	
	}else if(isContain(message, 'quien eres') ){
		finalMessage = 'Un humilde servidor';
	}else if(isContain(message, 'amo') ){
		finalMessage = 'Mi amo es Macario el rey, magestuoso Dios';
	}else if(isContain(message, 'hola') ){
		finalMessage = 'Hola, ¿Como estas?';
	}

	else{
		finalMessage = 'Estoy aprendiendo, ahorita solo repito cosas : ' + message;
	}
    

	sendMessageText(recipientId,finalMessage);

}

function sendMessageText(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}


function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: APP_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

function isContain(sentence, word){

	return sentence.indexOf(word) > -1;
}