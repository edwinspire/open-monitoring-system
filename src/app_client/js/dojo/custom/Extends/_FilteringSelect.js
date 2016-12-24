// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "dijit/form/FilteringSelect", "dojo/store/Memory",    'dojo/request', "dojo/_base/array"], function(lang, FilteringSelect, Memory, R, array){
  lang.extend(FilteringSelect, {
    Config: {Url: 'none.none', PlaceHolder: '', LoadOnCreate: false, Query: {}, Table: '', FieldValue: '', FieldLabel: '' }, 
    Load: function(_query){
var t = this;


if(t.Config.Url == 'undefined'){
t.Config.Url = 'select_by_ajax.undefined';
}

if(t.Config.PlaceHolder == 'undefined'){
t.Config.PlaceHolder = 'Selection';
}

if(!t.Config.LoadOnCreate){
t.Config.LoadOnCreate = false;
}

if(!_query){

if(!t.Config.Query){
_query = {};
}

}

_query._SelectTable = t.Config.Table;
_query._SelectFieldValue = t.Config.FieldValue;
_query._SelectFieldLabel = t.Config.FieldLabel;
_query._SelectFieldGroup = t.Config.FieldGroup;

 return R.post(t.Config.Url, {
                    data: _query,
                    handleAs: 'json'
                }).then(
                        function (response) {
var newData = [];

		array.forEach(response, function(item){
		
newData.push({
        id: item[t.Config.FieldValue],
        name: item[t.Config.FieldLabel],
        value: item[t.Config.FieldValue]
    });

		});
		
t.store = new Memory({data: newData});
console.log('Ha cargado los datos');

                        },
                        function (e) {
                            // Display the error returned
//window.NotificationArea({urgency: 1, message: e, title: 'Error!'});
  //                          t.emit('onError', {error: e});
  console.error(e);
                          //  alert(e);
                        }
                );
//return this;
},
        _postCreate: function () {
         
var t = this;
//console.log(arguments);
//t.inherited(arguments);

t.queryExpr = '*${0}*';
t.searchDelay = 600;


console.debug(t.Config);

if(t.Config.LoadOnCreate){
t.Load(t.Config.Query);
}
        }
        
        
        
        
  });
});
