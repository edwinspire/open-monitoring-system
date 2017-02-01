define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/Geolocations/Geolocations.html',
    "dojo/dom-style",
    "dojo/window",
    "dojo/on"
    ], function (declare, _Widget, _Templated, templateString, domStyle, w, on) {

        return declare([_Widget, _Templated], {
            widgetsInTemplate: true,
            templateString: templateString,
            postCreate: function () {
                var t = this;

                // t.CollapseLink.set('contentelement', t.XContent);

                // on(t.CollapseLink, 'click', function(){
                //     domStyle.set(t.MapIframe, 'height', w.getBox().h-120+'px');
                // });

                domStyle.set(t.domNode, 'height', w.getBox().h-120+'px');
                this.MapIframe.src = "map.html?maptype=all_contacts";

            }
        /*,
        _setIdcontactAttr: function (_idcontact) {
          //this.Input.set('value', _v, _t);
	this.MapIframe.src = "map.php?idcontact="+_idcontact+"&maptype=1";
        },
        _getIdcontactAttr: function () {
          return this;
        } 
        */













    });
    });
