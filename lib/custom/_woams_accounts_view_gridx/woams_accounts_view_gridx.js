define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_accounts_view_gridx/woams_accounts_view_gridx.html',
    'dojo/request',
    "gridx/Grid",
    "jspire/Gridx",
    "dojo/dom-style",
    'dojo/store/Memory',
    'dojo/on',
    "dojo/NodeList-traverse",
    'gridx/modules/Focus',
    "gridx/core/model/cache/Async",
    'gridx/modules/Focus', 'gridx/modules/VirtualVScroller', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/RowHeader', 'gridx/modules/select/Row', 'gridx/modules/extendedSelect/Row', 'gridx/modules/IndirectSelect', "gridx/modules/Pagination", "gridx/modules/pagination/PaginationBar", "gridx/modules/ColumnResizer", "gridx/modules/Filter",
    "gridx/modules/filter/FilterBar",
    "gridx/modules/filter/QuickFilter",
    "gridx/modules/SingleSort",
    "gridx/modules/extendedSelect/Row",
    "gridx/modules/IndirectSelectColumn",
    "gridx/modules/VirtualVScroller"
], function (declare, _Widget, _Templated, templateString, request, Grid, jG, domStyle, Memory, on) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        Url: "/oams_php_query/accounts_view_list.php",
        Grid: new Grid({}),
        postCreate: function () {
            var t = this;
//var h_ini = domStyle.get(t.Contenedor, 'height');
//domStyle.set(t.Contenedor, 'height', (h_ini-25)+'px');
            t.create_grid(0);
            t.load();
        },
        create_grid: function (type_grid) {

            var t = this;
            t.Grid = new Grid({
                store: new Memory({}),
                structure: t._grid_structure(type_grid),
                paginationInitialPageSize: 25,
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
                //console.log(e);
                //on.emit(t, 'onitemclick', e);
                t.emit('onitemclick', e);
            });


        },
        _grid_structure: function (type_grid) {

            var structure = new Array();
            structure[0] = [{field: "unique_id", name: "#", width: '20px'},
                {field: "account", name: "Abonado", width: '50px'},
                {field: "account_name", name: "Nombre"},
                {field: "enabled", name: "*", width: '40px'},
                {field: "identification", name: "identification"}
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
        load: function () {
            var t = this;

//console.log(domStyle.get(t.Contenedor, 'height'));
//		t.Grid.resize({h: domStyle.get(t.Contenedor, 'height')});
            // Request the text file
            request.post(t.Url, {
                //data: {oficina: _oficina},
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
                                    idcontact: response[i].idcontact,
                                    account: response[i].account,
                                    account_name: response[i].last_name + " " + response[i].first_name,
                                    enabled: response[i].enabled,
                                    note: response[i].note,
                                    identification: response[i].identification
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
