define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!ContactWidget/ContactWidget.html',
"uDC/uDC"
], function (declare, _Widget, _Templated, templateString, uDataControl) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
	//IdAccount: -999,
	//uDC: new uDataControl(),
        postCreate: function () {
            var t = this;
/*
t.uDC.Config.SelectorClass = '.ContactWidget_class_udc';
t.uDC.Config.NodeContainer = t.domNode;
t.uDC.Config.ReferentialField = "idcontact";
t.uDC.Config.UrlData = "php/query/accounts.php";
t.uDC.Config.Table = "accounts";
t.uDC.BindFields();
//console.log(t.uDC);
*/

        },
        resize: function (s) {
//this.BC1.resize({h: '40%'});
//console.log("Cambiando de tamaño");
        },
        _setIdcontactAttr: function (_id) {
          this.IdAccount = _id;
	this.uDC.Select(this.IdAccount);
        },
        _getIdcontactAttr: function () {
          return this.IdAccount;
        }        












    });
});
