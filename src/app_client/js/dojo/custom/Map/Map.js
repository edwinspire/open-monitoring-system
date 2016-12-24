define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Map/Map.html',
"dijit/TooltipDialog",
"dijit/popup", 
'dojo/request',
"dojo/on",
"dojo/_base/array"
], function (declare, _Widget, _Templated, templateString, TTD, popup, request, on, array) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
         
var t = this;

t.MapIframe.src = "map.php?idcontact=0&maptype=1";
//window.frames.FrameMap.document.getElementById('popup').innerHTML = "Nuevo texto del iframe";
//console.log(t.MapIframe.getElementById('popup'));

        },
        _setIdcontactAttr: function (_idcontact) {
          //this.Input.set('value', _v, _t);
	this.MapIframe.src = "map.php?idcontact="+_idcontact+"&maptype=1";
        },
        _getIdcontactAttr: function () {
          return this;
        } 







    });
});
