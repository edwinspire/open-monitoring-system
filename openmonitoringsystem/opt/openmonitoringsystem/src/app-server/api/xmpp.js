define(['dojo/_base/declare',  "dojo/Evented", "dojo/node!crypto", "dojo/node!@xmpp/client"
	], function (declare, Evented, crypto, xmppC) {

		return declare('xmpp', [Evented], {
			client: new xmppC.Client(),
			server: 'localhost',
			username: 'user',
			password: 'pwd',

			constructor: function(server, user, pwd){
				this.server = server;
				this.username = user;
				this.password = pwd;

				this.client.on('error', err => {
					console.error('❌', err.toString()+' -->', process.env.XMPP_SERVER, process.env.XMPP_USERNAME, process.env.XMPP_PASSWORD)
				})

				this.client.on('status', (status, value) => {
					console.log('> ', status, value ? value.toString() : '')
				})


				this.client.on('stanza', el => {
					if (el.is('presence') && el.attrs.from === this.client.jid.toString()) {
						console.log('🗸', 'available, ready to receive <message/>s')
					}
					if (el.is('message')) {
						console.log(JSON.stringify(el));    
					}
				})

				this.client.on('online', jid => {
					console.log('jid', jid.toString())
					this.client.send(xmppC.xml('presence'))
				});

				this.client.handle('authenticate', authenticate => {
					return authenticate(this.username, this.password)
				});

				this.client.handle('bind', bind => {
					return bind('example')
				});

				this.client.start(this.server).catch(err => {
					console.error('start failed', err)
				});

			},
			send: function(_to, _message){

console.log(this.client);

				this.client.send(
					xmppC.xml('message', {to: _to, type: 'chat'},
						xmppC.xml('body', {}, _message)
						)
					);
			}
		}



		);
	});
