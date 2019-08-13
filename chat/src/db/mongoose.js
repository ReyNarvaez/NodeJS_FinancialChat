const mongoose = require('mongoose');
const Chat = require('../models/chat');
console.log('starting database connection to: ' + process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true
});

var db = mongoose.connection;

db.on('error', function(){
	console.log('failed to connect to database: ' + process.env.MONGODB_URL);
});

db.once('open', async function (){
	console.log('connected to database');
  createChats();
});

const createChats = async () => {
    
  console.log('creating static chats');
  var chatNames = ["Financial", "General", "Random"];

  for(var i = 0; i < chatNames.length; i++){
  	try{
  		const chat = new Chat({'title': chatNames[i]});
  		await chat.save()
  		console.log('Created chat ' + chatNames[i]);
  	}
  	catch(error){
      //Chats are already created
  		//console.log('error creating chat ' + chatNames[i] + ": " + error);
  	}
  }
}