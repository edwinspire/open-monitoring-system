define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!ContactMap/ContactMap.html',
"dijit/TooltipDialog",
"dijit/popup", 
'dojo/request',
"dojo/on",
"dojo/_base/array",
"dojo/dom-style",
"dojo/window",
"dojo/cookie"
], function (declare, _Widget, _Templated, templateString, TTD, popup, request, on, array, domStyle, w, cookie) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        postCreate: function () {
         
var t = this;
//t.CollapseLink.set('contentelement', t.XContent);
domStyle.set(t.domNode, 'height', w.getBox().h-125+'px');

        },
        _setIdcontactAttr: function (_idcontact) {
	this.MapIframe.src = "map.html?idcontact="+_idcontact+'&maptype=contact_only';
	
	return this;
        },
        _getIdcontactAttr: function () {
          return this;
        },
        resize: function(){
         //TODO
        }/*,
        Up: function(){
        this.CollapseLink.Up();
        },
	Down: function(){
	        this.CollapseLink.Down();
	}
*/





    });
});
