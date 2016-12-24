define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!select/select.html'
], function (declare, _Widget, _Templated, templateString) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
         var t = this;
              console.log(t.get("id"));
          
                 $(t.Select).select2({
          placeholder: "Select a state",
          allowClear: true,
          theme: "classic"
        });
        
         
        },
        _setLabelAttr: function (label_) {
          //  this.label.innerHTML = label_;
        }
    });
});
