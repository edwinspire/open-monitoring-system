//>>built
define("jspire/Gridx", ["dojo/_base/declare"], function () {

    return {
// Requiere los modulos 'gridx/modules/RowHeader', 'gridx/modules/select/Row', 'gridx/modules/extendedSelect/Row', 'gridx/modules/IndirectSelect'
// Tambien debe tener un campo unique_id visible para usarlo como referencia
        addRowSelection: function (g, namefiel) {
            var t = this;
            g.RowSelected = [];

            dojo.connect(g.select.row, 'onSelectionChange', function (selected) {
//console.log('onSelectionChange');
                g.RowSelected = [];
                numsel = selected.length;
                var i = 0;
                while (i < numsel) {
                    var item = t.searchItem(g, selected[i]);

//console.log(item);
                    if (item) {
                        console.log(namefiel + ' =>> ' + item[namefiel]);
                        g.RowSelected.push(item[namefiel]);
                    }
                    i++;
                }
//console.log(g.RowSelected);
            });
            return t;
        },
// El store debe tener un campo unique_id para usarlo como referencia
        addEventItemClick: function (g) {
            var t = this;
            dojo.connect(g, 'onRowClick', function (event) {
                var item = t.searchItem(g, event.rowId);
                if (item) {
                    g.emit('ItemClick', item);
                }
            });
        },
        searchItem: function (g, rowId) {
            return g.store.query({unique_id: rowId})[0];
        },
// Requiere los modulos 'gridx/modules/RowHeader', 'gridx/modules/select/Row', 'gridx/modules/extendedSelect/Row', 'gridx/modules/IndirectSelect'
// Tambien debe tener un campo unique_id visible para usarlo como referencia
        addItemSelection: function (g) {
            var t = this;
            g.ItemSelected = [];
            dojo.connect(g.select.row, 'onSelectionChange', function (selected) {
                g.ItemSelected = [];
                numsel = selected.length;
                var i = 0;
                while (i < numsel) {
                    var item = t.searchItem(g, selected[i]);
                    if (item) {
                        g.ItemSelected.push(item);
                    }
                    i++;
                }
            });

            return g;
        },
// EditorArgs para una columna booleana de gridx editable, la columna debe usar como editor un checkbox y estar como alwaysEditing: true para que muestre el checkbox
        EditorArgsToCellBoolean: {
            props: 'value: true',
            fromEditor: function (d) {
                d1 = d + '';
                return d1.to_boolean();
            },
            toEditor: function (storeData, gridData) {
                r = gridData + '';
                return r.to_boolean();

            }
        },
// EditorArgs para una columna booleana de gridx editable, la columna debe usar como editor un checkbox y estar como alwaysEditing: true para que muestre el checkbox, pero no es editable
        EditorArgsToCellBooleanDisabled: {
            props: 'value: true, disabled: "true"',
            fromEditor: function (d) {
                d1 = d + '';
                return d1.to_boolean();
            },
            toEditor: function (storeData, gridData) {
                r = gridData + '';
                return r.to_boolean();
            }
        }

    };
});
