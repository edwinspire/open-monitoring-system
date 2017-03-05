// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg"], function(lang, OMS, pg){
	lang.extend(OMS, {
/////////////////////////////////////////

receiver_event: function(req, res){

	var t = this;
	var post = req.body;
	post['ideventreceptionmode'] = 3;

	if(post.EventTable && (post.idaccount || post.idequipment) && post.ideventtype){

		var qp;

		switch(post.EventTable){
			case 'events':
			t._events(res, post);
			break;
			case 'events_dbsizes':
			t._events(res, post);
			break;	
			case 'events_device_uptime':
			t._events(res, post);
			break;	
			case 'events_jobs':
			t._events(res, post);
			break;	
			case 'events_networkdevice_ping':
			t._events(res, post);
			break;	
			default:
			res.status(500).json({success: false, data: "Intentando una accion invalida "+post.EventTable, req: post});
			break;

		}


	}else{
		res.status(500).json({success: false, data: "No ha definido una tabla a buscar"});
	}


}  ,
_events: function(res, post){

	var t = this;
	var w = {};

		qp = t.Insert(post.EventTable, post, []).returning(' idevent ').build();
		console.log(qp);
		t.emit('tschange', qp);

		t.response_insert(res, qp.query, qp.param);
	}

}





});
});
