define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_events_monitor_gridx/woams_events_monitor_gridx.html',
    'dojo/request',
    "gridx/Grid",
    "jspire/Gridx",
    'dojo/store/Memory',
    'dojo/dom-construct',
    'gridx/modules/Dod',
    'woams_event_comments/woams_event_comments',
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
], function (declare, _Widget, _Templated, templateString, request, Grid, jG, Memory, domConstruct, Dod, WEC) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        Url: "oams_php_query/view_events_monitor.php",
        _type_grid: 0,
        Grid: new Grid({}),
        _enable_load: false,
        postCreate: function () {
            var t = this;
            setTimeout(function () {
                t._enable_load = true;
            }, 3000);
        },
        create_grid: function (type_grid) {

            var t = this;
            domConstruct.empty(t.Contenedor);

            if (type_grid >= 0) {
                t._type_grid = type_grid;
            }
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
            jG.addRowSelection(t.Grid, 'idevent');

            dojo.connect(t.Grid, "onItemClick", function (e) {
                //console.log(e);
                t.emit('onitemclick', e);
            });


        },
        _color_class: function (n) {
            var b;
            try {
                b = 'levelbg' + n;
            } catch (error) {
                b = '';
            }
//console.log(b);
            return b;
        },
        _grid_structure: function (type_grid) {
            var t = this;
            var structure = new Array();
// Para ver todos los eventos de forma general
            structure[0] = [{field: "unique_id", name: "#", width: '35px'},
                {field: "idevent", name: "id", width: '40px'},
                {field: "dateevent", name: "Fecha", width: '90px', dataType: 'datetime'},
                {field: "account", name: "Abonado", width: '50px'},
                {field: "account_name", name: "Nombre"},
                {field: "code", name: "Codigo", width: '50px'},
                {field: "zu", name: "Zona", width: '40px'},
                {field: "priority", name: "P", width: '20px', class: function (cell) {
                        return t._color_class(cell.data());
                    }},
                {field: "label", name: "Evento", width: '100px'},
                {field: "description", name: "Descripcion"},
                {field: "status_label", name: "Estado", width: '50px'},
                {field: "oams_assigned", name: "Asignado"},
                {field: "last_comment", name: "Ultimo Comentario", width: '80px'}
            ];

// Para ver los eventos de un abonado en particular
            structure[1] = [{field: "unique_id", name: "#", width: '35px'},
                //    {field:"idevent", name: "id", width: '40px'},
                {field: "dateevent", name: "Fecha", width: '90px', dataType: 'datetime'},
                //{field:"account", name: "Abonado", width: '50px'},
                //{field:"account_name", name: "Nombre"},
                {field: "code", name: "Codigo", width: '50px'},
                {field: "zu", name: "Zona", width: '40px'},
                {field: "priority", name: "P", width: '20px', class: function (cell) {
                        return t._color_class(cell.data());
                    }},
                {field: "label", name: "Evento", width: '100px'},
                {field: "description", name: "Descripcion"},
                {field: "status_label", name: "Estado", width: '50px'},
                {field: "oams_assigned", name: "Asignado"},
                {field: "last_comment", name: "Ultimo Comentario", width: '80px'}
            ];


            structure[2] = [{field: "unique_id", name: "#", width: '35px'},
                //  {field:"idevent", name: "id", width: '40px'},
                {field: "dateevent", name: "Fecha", width: '90px', dataType: 'datetime'},
                {field: "account", name: "Abonado", width: '50px'},
                {field: "account_name", name: "Nombre"},
                {field: "code", name: "Codigo", width: '50px'},
                {field: "zu", name: "Zona", width: '40px'},
                {field: "priority", name: "P", width: '20px', class: function (cell) {
                        return t._color_class(cell.data());
                    }},
                {field: "label", name: "Evento", width: '100px'},
                {field: "description", name: "Descripcion"},
                {field: "status_label", name: "Estado", width: '50px'},
                {field: "oams_assigned", name: "Asignado"},
                {field: "last_comment", name: "Ultimo Comentario", width: '80px'}
            ];

            structure[3] = structure[0];

            return structure[type_grid];
        },
        resize: function (r) {
            return this.Grid.resize(r);
        },
        load: function (_idaccount) {

            var t = this;
            if (t._enable_load) {

                t._enable_load = false;

                if ((!_idaccount || _idaccount < 1)) {
                    _idaccount = 0;
                }
                console.log("Solicita carga eventos de " + _idaccount);
                //t.Grid.resize({h: domStyle.get(t.Contenedor, 'height')});
                // Request the text file
                request.post(t.Url, {
                    data: {idaccount: _idaccount, type_grid: t._type_grid},
                    // Parse data from xml
                    handleAs: "json"
                }
                ).then(
                        function (response) {

                            var myData = {
                                identifier: "unique_id", items: []
                            };

                            dojo.forEach(response, function (item, i) {

                                myData.items.push({
                                    unique_id: i + 1,
                                    idevent: item.idevent,
                                    dateevent: item.dateevent,
                                    account: item.account,
                                    status_label: item.status_label,
                                    code: item.code,
                                    account_name: item.last_name + " " + item.first_name,
                                    zu: item.zu,
                                    priority: new Number(item.priority),
                                    description: item.description,
                                    last_comment: item.last_comment,
                                    oams_assigned: item.oams_assigned,
                                    label: item.label
                                }
                                );


                            });

                            t._grid_setData(myData);
                        },
                        function (error) {
                            console.log(error);
                            // Display the error returned
                            t._enable_load = true;
                            t.Grid.emit('onnotify', {msg: error});
                        }
                );
                t.Grid.resize();
            }

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
            console.log('Aqui termina de cargar y mostrar');
            t._enable_load = true;
        }







    });
});
