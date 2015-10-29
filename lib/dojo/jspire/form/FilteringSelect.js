define("jspire/form/FilteringSelect", ["dojo/_base/declare", "dojo/request", "dojo/store/Memory", "dijit/form/FilteringSelect"], function (_1, R, M, FS) {

    FS.prototype.url = "localhost";
// Agregamos esta funcion de esta forma para evitar un mal funcionamiento cuando el filteringselect es una celda de un Gridx.
// Una vez cargados los datos se setea y se conecta el evento Change.
    FS.prototype.postLoad = function () {
        var t = this;
        t.set("value", "0");
        console.log('postLoad');
        t.on('Change', function (e) {
            console.log(t.get("value"));
//t.emit('Change', {});
        });

    }

    FS.prototype.load_json = function (_query) {
        var t = this;
        R.get(t.url, {
            handleAs: "json",
            query: _query
        }
        ).then(
                function (response) {
                    var rs1 = new M({data: response});
                    t.store = rs1;
                    t.postLoad();
                },
                function (error) {
                    console.log(error);
                    // Display the error returned
                }
        )
    };





    /*
     
     return  {
     addXmlLoader: function(filteringselect, url, ri, q, id, name, vep){
     
     filteringselect._Url = url;
     filteringselect._RootItem = ri;
     filteringselect._Query = q;
     filteringselect._TagId = id;
     filteringselect._TagName = name;
     filteringselect._ValueEverPresent = vep;
     
     filteringselect.postLoad = function(){
     filteringselect.reset();
     console.log('FilteringSelect reset postLoad');
     }
     
     // Carga Asincronamente los datos y setea el FilteringSelect
     filteringselect.Load = function(){
     // Request the text file
     R.get(url, {
     query: filteringselect._Query,
     // Parse data from xml
     handleAs: "xml"
     }).then(
     function(response){
     var d = new RXml.getFromXhr(response, filteringselect._RootItem);
     numrows = d.length;
     var Items = [];
     
     var i = 0;
     while(i<numrows){
     Items[i] =    {name: d.getStringFromB64(i, filteringselect._TagName), id: d.getString(i, filteringselect._TagId)};
     i++;
     }
     
     if(filteringselect._ValueEverPresent){
     Items[i] =    {name: filteringselect._ValueEverPresent.name, id: filteringselect._ValueEverPresent.id};
     }
     filteringselect.store = null;
     filteringselect.store = new M({data: Items});
     filteringselect.startup();
     filteringselect.postLoad();
     filteringselect.emit('onloaddata', {});
     },
     function(error){
     // Display the error returned
     filteringselect.emit('onnotify', {msg: error});
     }
     );
     
     }
     return filteringselect;
     }
     }
     */

});

