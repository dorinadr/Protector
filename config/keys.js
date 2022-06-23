
//DB Connection
const wsUser = { id:process.env.MONGOUSER,password:process.env.MONGOPASS, template_url:process.env.MONGOURLTEMPLATE };
const mongoURL = wsUser.template_url.replace('<password>', wsUser.password).replace("<user_name>", wsUser.id);
module.exports = {
    mongoURI: mongoURL
};
