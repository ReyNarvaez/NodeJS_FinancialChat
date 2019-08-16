const mongoose = require('mongoose');
const Chat = require('../models/chat');
const User = require('../models/user');
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
  createTestUser();
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

const fullCorrectUser = {'name': 'testUser', 'email': 'test_user@test.com', 'password': '1234567' };

const createTestUser = async () => {
    
  console.log('creating test user');
  
  try{

    const user = new User(fullCorrectUser);
    await user.save();
    console.log('Created test user ' + fullCorrectUser.email);
  }catch(e){
    //test user is already created
    //console.log('error creating test user ' + fullCorrectUser.email);
  }
}

