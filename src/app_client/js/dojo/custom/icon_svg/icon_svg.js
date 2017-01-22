define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/icon_svg/icon_svg.html'
    ], function (declare, _Widget, _Templated, templateString) {

        return declare([_Widget, _Templated], {
            widgetsInTemplate: true,
            templateString: templateString,
            path_base: 'vendors/fa-svg/svg-black/',
            postCreate: function () {
                console.log(this.icon);
                if(this.icon){
                    this.set("icon", this.icon);	
                }


            },
            _setIconAttr: function(icon){
             this.Image.src = this.path_base+icon;
         }


     });
    });
