// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/_base/array"], function(lang, OMS, pg, array){
  lang.extend(OMS, {
/////////////////////////////////////////
udc_table_account_users: function(req, res){

var t = this;

if(req.body.UdcTable){

var post = req.body;
var qp;

switch(post.UdcAction){
case 'select_rows':

switch(req.body.UdcTable){
case 'view_account_users':

var w = {};
w["idaccount"] = post.idaccount;
qp = t.Select(post.UdcTable, []).whereAnd([w]).build();

t.response_query(req, res, qp.query, qp.param);
break;
default:
       res.status(500).json({success: false, data: "Intentando una accion invalida "+post.UdcAction, req: post});
break;
}




break;
default:
       res.status(500).json({success: false, data: "Intentando una accion invalida "+post.UdcAction, req: post});
	//return false;
break;

}

}else{
       res.status(500).json({success: false, data: "No ha definido una tabla a buscar"});
}

}              
        
        
  });
});
