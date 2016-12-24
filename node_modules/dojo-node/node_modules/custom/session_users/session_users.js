define(['dojo/_base/declare',  "dojo/Evented", "dojo/node!crypto", "dojo/store/Memory"
	], function (declare, Evented, crypto, Memory) {

		return declare('session_users.session_users', [Memory, Evented], {

//store: {},
//////////////////////////////////
// The constructor
constructor: function(args) {
//this.session = {};
dojo.safeMixin(this,args);
var t = this;
setInterval(function(){
	t.query().forEach(function(item){

		var time = Date.now() - item.heartbeat;

//t.emit('newsession', {t: time, h: item.heartbeat});
if(time > 30000){
//	t.remove(item.id);
t.emit('dead_session', item);
}


});
}, 40*1000);

},
///////////////////////////////////////////////////////////////
encrypt: function(myMessage, myPassword){
	var cipher = crypto.createCipher('aes192', myPassword);
	var crypted = cipher.update(myMessage,'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
},
decrypt: function(ciphertext, myPassword){
	try{
		var decipher = crypto.createDecipher('aes192',myPassword)
		var dec = decipher.update(ciphertext,'hex','utf8')
		return dec += decipher.final('utf8');
	}catch(e){
		console.warn(e);
		return false;
	}
},
add_user: function(datauser, req, res){
	datauser['heartbeat'] = Date.now();
//var token = crypto.createHash('md5').update(req.connection.remoteAddress+Date.now()).digest("hex");
datauser['login'] = Date.now();
datauser['pwd'] = this.pwd(req);
var sid = this.encrypt(JSON.stringify({idlogin: datauser.idlogin, IP: req.connection.remoteAddress, login: datauser.login}), datauser.pwd);
datauser['id'] = sid;
datauser['ip'] = req.connection.remoteAddress;
this.put(datauser);
res.cookie('oms_sessionidclient', sid, { maxAge: 3600000});
res.cookie('oms_fullname', datauser.fullname, { maxAge: 3600000});
this._remove_same_user_sessions(datauser);
this.emit('newsession', {});
return sid;
},
datauser: function(sessionidclient){
	var r = false;
	var du = this.get(sessionidclient);

	if(du){

		if(this.decrypt(sessionidclient, du.pwd)){
			r = du;
		}


	}
	return r;
},
isauthorized: function(req, res, logout){
	
	if(req.cookies['oms_sessionidclient']){
		return this.datauser(req.cookies['oms_sessionidclient']);
	}else{
		if(logout){
			res.redirect('/njs/logout');
		}
		return false;
	}

},
pwd: function(req){
	return crypto.createHash('md5').update(req.headers['user-agent']+req.connection.remoteAddress).digest("hex");
},
_remove_same_user_sessions: function(datauser){

//this.emit('newsession', this.query({idlogin: datauser.idlogin}));
var t = this;

this.query({idlogin: datauser.idlogin}).forEach(function(item){

	if(item.id != datauser.id){
		t.remove(item.id);
	}

});

},
users_status: function(){
return this.query();	
}




});
	});
