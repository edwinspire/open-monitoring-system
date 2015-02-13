define("jspire/request/uHTTPDataSource",["dojo/_base/declare", 'dojo/request'],function(_1, _2){

var r = function(){

};
r.id = 0;


r.prototype = {

data_: {},

url_load: "/uxsql/default_query.uxsl",
url_save: "/uxsql/default_query.uxsl",
url_delete: "/uxsql/default_query.uxsl",

load: function(idrow){
this.id = idrow;
var t = this;
   _2.post(this.url_load, {
		data: {id: this.id},
            handleAs: "json"
        }).then(
                function(response){
               		t.data_ = response;
               		console.log(t.data_);
               		t.emit('onLoad', response);
                },
                function(error){
                    // Display the error returned
console.log(error);
                }
            );


return "";
},

save: function(){

return "";
},

delete: function(){

return "";
}

};

return r;
});
