define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!top_tile/top_tile.html'
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        Config: {},
        postCreate: function () {
        var t = this;
            
// Esta configuracion es obtenida de la declarada por html
var getconf = dojo.fromJson(t.get("data-widget-config"));
console.log(getconf);

if(getconf){
t.Config = getconf;

if(t.Config.Title){
t.set("Title", t.Config.Title);
}

if(t.Config.Value){
t.set("Value", t.Config.Value);
}

if(t.Config.SubValueDescription){
t.set("SubValueDescription", t.Config.SubValueDescription);
}

if(t.Config.SubValue){
t.set("SubValue", t.Config.SubValue);
}

}else{
console.log('No hay datos de configuracion declarados en HTML');
}            
            
            
            
        },
        _setSubvaluedescriptionAttr: function (t_) {
            this.SubValueDescription.innerHTML = t_;
        },
        _setSubvalueAttr: function (t_) {
            this.SubValue.innerHTML = t_;
        },        
        _setTitleAttr: function (t_) {
            this.Title.innerHTML = t_;
        },        
        _setValueAttr: function (v_) {
            this.Value.innerHTML = v_;
        }        
    });
});
