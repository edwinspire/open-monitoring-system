// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/_base/array"], function(lang, OMS, pg, array){
  lang.extend(OMS, {
/////////////////////////////////////////

udc_tables_views: function(req, res){

    var t = this;

    if(req.body.UdcTable){

        var post = req.body;
        var qp;

        switch(post.UdcAction){
            case 'select_rows':
            var w = {};
//w["idaccount"] = post.idaccount;

qp = t.Select(post.UdcTable, []).orderBy(" tv_name ").build();
t.response_query(req, res, qp.query, qp.param);


break;
case 'update':
var w = {};

w[post.UdcRowFingerPrint] = post.UdcRowFingerPrintValue;
w[post.UdcIdProperty] = post[post.UdcIdProperty]

qp = t.Update(post.UdcTable, post, ['idtableview']).whereAnd([w], ['UdcTable', 'UdcIdProperty', 'UdcRowFingerPrintValue', 'UdcRowFingerPrint', 'UdcAction', 'title_dgrid']).build();
t.response_update(req, res, qp.query, qp.param);

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
