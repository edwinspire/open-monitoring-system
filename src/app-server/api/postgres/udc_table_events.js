// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/_base/array"], function(lang, OMS, pg, array){
  lang.extend(OMS, {
/////////////////////////////////////////

udc_table_events: function(req, res, datauser){

    var t = this;

    if(req.body.UdcTable && req.body.UdcTable == 'events'){

        var post = req.body;
        var qp;

        switch(post.UdcAction){
            case 'select_rowsxxx':
            var w = {};

            qp = t.Select(post.UdcTable, []).orderBy(" tv_name ").build();
            t.response_query(res, qp.query, qp.param);


            break;
            case 'updatexxx':
            var w = {};

            w[post.UdcRowFingerPrint] = post.UdcRowFingerPrintValue;
            w[post.UdcIdProperty] = post[post.UdcIdProperty]

            qp = t.Update(post.UdcTable, post, ['idtableview']).whereAnd([w], ['UdcTable', 'UdcIdProperty', 'UdcRowFingerPrintValue', 'UdcRowFingerPrint', 'UdcAction', 'title_dgrid']).build();
            t.response_update(res, qp.query, qp.param);

            break;
            case 'insert':
            var w = {};

            if(post.idaccount && post.ideventtype){

                post['ideventreceptionmode'] = 1;

                if(datauser.isadmin){
                    post['idadmin'] = datauser.idadmin;
                    post['idadmin_assigned'] = datauser.idadmin;
                }

                qp = t.Insert(post.UdcTable, post, []).returning(' idevent ').build();

                console.log(qp);
                t.emit('tschange', qp);

                t.response_insert(res, qp.query, qp.param);
            }else{
                res.status(500).json({success: false, data: "Faltan parametros "+post.UdcAction, req: post});    
            }


            break;
            default:
            res.status(500).json({success: false, data: "Intentando una accion invalida "+post.UdcAction, req: post});
            break;

        }


    }else{
     res.status(500).json({success: false, data: "No ha definido una tabla a buscar"});
 }


}              


});
});
