define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_phone_types_gridx/woams_phone_types_gridx.html',
    'dojo/request',
    "gridx/Grid",
    "jspire/Gridx",
    "dojo/dom-style",
    'dojo/store/Memory',
    "dojo/NodeList-traverse",
    "dojo/data/ItemFileWriteStore",
    'gridx/modules/Focus',
    "gridx/core/model/cache/Async",
    'gridx/modules/Focus', 'gridx/modules/VirtualVScroller', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/RowHeader', 'gridx/modules/select/Row', 'gridx/modules/extendedSelect/Row', 'gridx/modules/IndirectSelect', "gridx/modules/Pagination", "gridx/modules/pagination/PaginationBar", "gridx/modules/ColumnResizer", "gridx/modules/Filter",
    "gridx/modules/filter/FilterBar",
    "gridx/modules/filter/QuickFilter",
    "gridx/modules/SingleSort",
    "gridx/modules/extendedSelect/Row",
    "gridx/modules/IndirectSelectColumn",
    "gridx/modules/VirtualVScroller"
], function (declare, _Widget, _Templated, templateString, request, Grid, jG, domStyle, Memory) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        Url: "/php_query/view_server_raid_reporte_full_json.php",
        Grid: new Grid({}),
        postCreate: function () {
            var t = this;
            var h_ini = domStyle.get(t.Contenedor, 'height');
            domStyle.set(t.Contenedor, 'height', (h_ini - 25) + 'px');

//t.create_grid(0);
//t.startup();
//t._load();
        },
        create_grid: function (type_grid) {

            var t = this;
            t.Grid = new Grid({
                store: new Memory({}),
                structure: t._grid_structure(type_grid),
                paginationInitialPageSize: 25,
                barTop: [
                    {content: 'REPORTES SERVIDORES RAID', style: 'display: inline; float: left; text-align: center; font-size: 1.25em; font-weight: bolder; text-shadow: 3px 3px 3px #fff;'},
                    null
                ],
                //autoHeight: true,
                //autoWidth: true,
                modules: [
                    'gridx/modules/Focus', 'gridx/modules/VirtualVScroller', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/RowHeader', 'gridx/modules/select/Row', 'gridx/modules/extendedSelect/Row', 'gridx/modules/IndirectSelect', "gridx/modules/Pagination", "gridx/modules/pagination/PaginationBar", "gridx/modules/ColumnResizer", "gridx/modules/Filter",
                    "gridx/modules/filter/FilterBar",
                    "gridx/modules/filter/QuickFilter",
                    "gridx/modules/SingleSort",
                    "gridx/modules/extendedSelect/Row",
                    "gridx/modules/IndirectSelectColumn"
                ],
                summary: 'this is the gridx'
            });
            t.Grid.placeAt(t.Contenedor);
            t.Grid.resize();
            t.Grid.startup();
            t._grid_clear();

            jG.addEventItemClick(t.Grid);
            jG.addRowSelection(t.Grid, 'oficina');

            dojo.connect(t.Grid, "onItemClick", function (e) {
                console.log(e);
            });


        },
        _grid_structure: function (type_grid) {
            var structure = new Array();
            structure[0] = [{field: "unique_id", name: "#", width: '20px'},
                {field: "oficina", name: "oficina", width: '50px'},
                {field: "nombre", name: "farmacia"},
                {field: "estado", name: "estado", width: '40px'},
                {field: "ip_server_farmacia", name: "ip_server_farmacia", width: '90px'},
                {field: "tecnico", name: "tecnico"},
                {field: "receivetime", name: "receivetime", width: '80px', dataType: 'datetime'},
                {field: "hostname", name: "hostname", width: '90px'},
                {field: "producttype", name: "producttype"},
                {field: "description", name: "description"},
                {field: "importancia", name: "importancia", width: '40px'}
            ];

            structure[1] = [{field: "oficina", name: "oficina", width: '50px', dataType: 'text'},
                {field: "nombre", name: "farmacia", dataType: 'text'},
                {field: "ip_server_farmacia", name: "ip_server_farmacia", width: '100px', dataType: 'text'},
                {field: "tecnico", name: "tecnico", dataType: 'text'}];

            return structure[type_grid];
        },
        resize: function (r) {
            return this.Grid.resize(r);
        },
        _load: function (_oficina) {
            console.log(_oficina);
            var t = this;

//console.log(domStyle.get(t.Contenedor, 'height'));
            t.Grid.resize({h: domStyle.get(t.Contenedor, 'height')});
            // Request the text file
            request.post(t.Url, {
                data: {oficina: _oficina},
                // Parse data from xml
                handleAs: "json"
            }
            ).then(
                    function (response) {

                        var myData = {
                            identifier: "unique_id", items: []
                        };

                        var i = 0;
                        numrows = response.length;
                        if (numrows > 0) {
                            while (i < numrows) {

                                myData.items.push({
                                    unique_id: i + 1,
                                    //idprovider: idp,
                                    oficina: response[i].oficina,
                                    nombre: response[i].nombre,
                                    estado: response[i].estado,
                                    ip_server_farmacia: response[i].ip_server_farmacia,
                                    tecnico: response[i].apellidos + " " + response[i].nombres,
                                    receivetime: response[i].receivetime,
                                    hostname: response[i].hostname,
                                    producttype: response[i].producttype,
                                    description: response[i].description,
                                    importancia: response[i].importancia,
                                    notas: response[i].notas
                                            //note: d.getStringFromB64(i, "note"),
                                            //ts: d.getString(i, "ts")
                                }
                                );

                                i++;
                            }
                        }
                        t._grid_setData(myData);
                    },
                    function (error) {
                        console.log(error);
                        // Display the error returned
                        t.Grid.emit('onnotify', {msg: error});
                    }
            );
            t.Grid.resize();
        },
        _grid_clear: function () {
            var myData = {identifier: "unique_id", items: []};
            this._grid_setData(myData);
        },
        _grid_setData: function (_data) {
            var t = this;
            //t.Store.clearOnClose = true;
            //t.Store.data = _data;
            //t.Store.close();
            //t.Store.data = new Memory({data: _data});
            t.Grid.store = null;
            t.Grid.setStore(new Memory({data: _data}));
        }







    });
});
