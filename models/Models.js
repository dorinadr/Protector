
//DB Connection
const wsUser = { id:process.env.MONGOUSER,password:process.env.MONGOPASS, template_url:process.env.MONGOURLTEMPLATE };
const mongoURL = wsUser.template_url.replace('<password>', wsUser.password).replace("<user_name>", wsUser.id);
//Mongoose instantiation
const mongoose = require('mongoose');
mongoose.connect(mongoURL,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', ()=> {
    console.error.bind(console, 'connection error:');
    }
);
db.once('open', function() {
console.log('Succesfully connected to database server');
});

//Models, and schemas for Mongoose
    //Login Model and schema
const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  });
  
  const User = mongoose.model('User', UserSchema);
  

     //User Info Model and schema
     const userInfoSchema = new mongoose.Schema(
        {
            userName: String,
            userId: mongoose.Schema.Types.ObjectId,
            firstName: String,
            lastName: String,
            email: String,
            shareInfo: Boolean,
            contact: Boolean,
            enableGps: Boolean
        }
    );
    const userInfo = mongoose.model('userInfo',userInfoSchema);

     
     //Reporting Model and schema
     const reportSchema = new mongoose.Schema(
        {
           gpsLocation: {latitude:Number, longitude:Number},
           email: String,
           questions: [{questionText: String, answerText: String}]


        }
    );
    const report = mongoose.model('report',reportSchema);
    //End of Mongoose Model and Schema Definitions
//End of Mongoose Instantiation



//End Helper function to copy location data from regular JS object to Mongoose location model
//Exports
exports.User = User;
exports.userInfo  = userInfo;
exports.report = report;
//End of Exports