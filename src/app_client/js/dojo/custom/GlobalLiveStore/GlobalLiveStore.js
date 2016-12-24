define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!GlobalLiveStore/GlobalLiveStore.html',
    'dojo/request', 'dojo/query', "LiveStore/DijitSelectStore", "dojo/window", "dojox/encoding/digests/MD5"
    ], function (declare, _Widget, _Templated, templateString, request, query, DijitSelectStore, win, MD5) {

        return declare([_Widget, _Templated], {
            widgetsInTemplate: true,
            templateString: templateString,
            postCreate: function () {

                var t = this;
                win.GlobalLiveStore = {};
                win.GlobalLiveStore._store = {};
                win.GlobalLiveStore.Store = function(_args){

                   var storeID = MD5(dojo.toJson(_args), dojox.encoding.digests.outputTypes.Hex);            

//console.log(_args);
if(!win.GlobalLiveStore._store[storeID]){
    win.GlobalLiveStore._store[storeID] = new DijitSelectStore(_args);
}

return win.GlobalLiveStore._store[storeID];
}








}





        // Fin de funciones //
        //************************************//
    });
    });
