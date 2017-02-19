define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/ContactGroup/ContactGroup.html',
    'dojo/request',
    "dojo/on",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/Evented"
    ], function (declare, _Widget, _Templated, templateString, request, on, array, domConstruct, query, Evented) {

        return declare([_Widget, _Templated, Evented], {
            widgetsInTemplate: true,
            templateString: templateString,
            _value: [],
            postCreate: function () {

            },
            _setGroupsAttr: function (_iddivision, _groups) {
               var t = this;
              // console.log(_groups)

               t._value = []
               domConstruct.empty(t.Container);

               if(_iddivision > 0 && _groups){

               var r = request.post("/njs/db/table/groups", {
                data: {UdcAction: 'select', iddivision: _iddivision, UdcTable: 'groups'},
                handleAs: 'json'
            }).then(
            function (response) {

               // console.log(response);

                array.forEach(response, function(group){

                    var string_input;

                    if(array.indexOf(_groups, group.idgroup) > -1){
                        string_input = '<input type="checkbox" checked/>';

                    }else{
                        string_input = '<input type="checkbox"/>';
                    }

                    var elem = domConstruct.toDom(string_input);
                    elem.name = group.name;
                    elem.value = group.idgroup;
                    elem.id = t.id+'_'+group.name+'_'+String(Math.random()).replace(".", "_");

                    dojo.place(elem, t.Container);
                    dojo.place('<label style="margin-right: 8px;  margin-left: 3px;" for="'+elem.id+'">'+elem.name+'</label>', t.Container);
//console.log(item);

on(elem, 'click', function(e){
//console.log('hay click', elem.value, e.target.value, e.target.checked);

if(e.target.checked){
    t._value.push(e.target.value);
}else{
    var a = [];

    array.forEach(t._value, function(g){

        if(g != e.target.value){
            a.push(g);
        }

    });

    t._value = a;

}

console.log(t._value);
t.emit('Change', {value: '{'+t._value.join()+'}'});
});
});


            },
            function (e) {
                console.log(e);
                    // Display the error returned
               //     t._notifications({ Urgency: 1, Message: e, Title: 'Error!' });
               //     t.emit('onError', { error: e });
                    //  alert(e);
                }
                );

            query("input", t.domNode).on("click", function(){
              console.log('Cambia');
          });
        }

        },
        _getValueAttr: function () {
           return '{'+this._value.join()+'}';
       },
       _setValueAttr: function (_v, _event) {
//         return this._value;
},
isValid: function(){
    return true; 
},
reset: function(){
    var t = this;
 t._value = []
               domConstruct.empty(t.Container);
return this;
}




});
    });
