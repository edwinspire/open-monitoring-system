/**
 * Handles elements
 * @namespace myNameSpace
 */
 define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/EventDetails/EventDetails.html',
    'dojo/on',
    "dijit/popup",
    "dojo/dom-style",
    "dojo/query",
    "evenstatustype_user_buttons/evenstatustype_user_buttons",
    "dijit/Editor" ,
    "Widget/uDCGridWidget/uDCGridWidget",
    "dijit/Toolbar",
    "dijit/ToolbarSeparator",
    "dijit/form/DropDownButton",
    "dijit/ConfirmTooltipDialog",
    "dijit/form/TextBox"
    ], function (declare, _Widget, _Templated, templateString, on, popup, domStyle, query) {

        return declare([_Widget, _Templated], {
            widgetsInTemplate: true,
            templateString: templateString,
            _tempValue: 0,
            postCreate: function () {

                var t = this;

        t.CommentField.startup();

        on(t.SelectEventStatus, 'Change', function(){

            if(t.uDCChangeStatus.getField('idevent')){
                domStyle.set(t.ContentEditor, 'display', 'inline-block');
            }
        });



                on(t.DialogCStatusCancel, 'click', function (e) {
                    domStyle.set(t.ContentEditor, 'display', 'none');
                });

               on(t.DialogCStatusOK, 'click', function (e) {
                 t.uDCChangeStatus.Insert().then(function(){
                     t.uDCChangeStatus.Clear();
                     domStyle.set(t.ContentEditor, 'display', 'none');
                 }); 
                  // popup.close(t.DialogChangeStatus);
              });







           },

        /**
 * Accept decimal input and return issue an error message.
 * @requires keybEdit
 */
 _setEventAttr: function (_v) {
    var t = this;
    console.debug(_v);
    

    t.uDCChangeStatus.setField('idevent', _v.idevent);   

    //t.set('idevent', _v.idevent);
    t._set_and_hide_show_field('idevent', _v.idevent);
    
    //t.set('dateevent', new Date(_v.dateevent).toLocaleString());
    t._set_and_hide_show_field('dateevent', new Date(_v.dateevent).toLocaleString());

    //t.set('priority', _v.priority);
    t._set_and_hide_show_field('priority', _v.priority);

    //t.set('description', _v.description);
    t._set_and_hide_show_field('description', _v.description);

    //t.set('status', _v.label_status);
    t._set_and_hide_show_field('status', _v.label_status);

    //t.set('equipment', _v.equipment);
    t._set_and_hide_show_field('equipment', _v.equipment);


    //t.set('eventtype', _v.label_eventtype);
    t._set_and_hide_show_field('eventtype', _v.label_eventtype);

    t.SelectEventStatus.set('value', _v.ideventstatustype);
    t.TEComments.Grid.Select({idevent: _v.idevent});



},
_set_and_hide_show_field: function(field, value){

    var t = this;
    query('.'+field, this.domNode).forEach(function(fielset){
        console.debug(fielset);

        query('.value', fielset).forEach(function(f, i){

            if(i == 0){

                if(value && value.length > 0){

 //t.set(field, value);    
 f.innerHTML = value;
 domStyle.set(fielset, 'display', 'inline-block');

}else{
 //t.set(field, value);    
 f.innerHTML = value;
 domStyle.set(fielset, 'display', 'none');
}

}

});




    });



},
Clear: function(){

},
resize: function(r){
this.TEComments.resize(r);
}

});
    });
