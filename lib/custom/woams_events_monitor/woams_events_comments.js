define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_events_comments/woams_events_comments.html',
    'dijit/ConfirmTooltipDialog',
    'dojo/on',
    'dijit/popup',
    'dijit/TooltipDialog',
    'woams_event_view/woams_event_view',
    'woams_event_comment_insert/woams_event_comment_insert',
    'woams_events_monitor_gridx/woams_events_monitor_gridx',
    'dijit/Toolbar',
    'dijit/form/Button',
    'dijit/form/TextBox',
    'dijit/layout/AccordionContainer',
    'dijit/layout/ContentPane',
    'dijit/TitlePane',
    'dijit/form/Form',
    'woams_event_comment_insert/woams_event_comment_insert'
], function (declare, _Widget, _Templated, templateString, CTtD, on, popup, TtD) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        _ideview: 'woams_event_view_' + (new Date().getTime()),
        _idec: 'woams_event_view_comment' + (new Date().getTime()),
        _base_id: 'woams_events_comments' + (new Date().getTime()),
        _idaccount: 0,
        //_disable_autoupload_events: false,
        _time_disable_upload_events: 300,
        _temp_time_disable_upload_events: 0,
        type_grid: 0,
        postCreate: function () {
            var t = this;
//	t._base_id= 'woams_events_comments'+(new Date().getTime());

            var myDialogNewEvent = new CTtD({
                content: ' <div id="' + t._ideview + '" data-dojo-type="woams_event_view/woams_event_view" style="width: 100%; height: auto;"></div> ',
                style: "width: 75%",
                onCancel: function () {
                    popup.close(myDialogNewEvent);
                },
                onExecute: function () {
                    var eview = dijit.byId(t._ideview);
                    eview.save_form();
                    popup.close(myDialogNewEvent);
                }
            });

            myDialogNewEvent.on('open', function () {
//console.warn(t._idaccount);
                var eview = dijit.byId(t._ideview);
                eview.new_to_account(t._idaccount);
            });

            on(t.new_event, 'click', function () {
                popup.open({
                    popup: myDialogNewEvent,
                    around: t.new_event.domNode
                });
            });



//*************************************************//

            var formexportcsv = '<div data-dojo-type="dijit/form/Form" method="POST" target="_blank" action="oams_php_query/view_events_monitor_to_csv.php">   <div style="display: inline-block;" class="campo">    <label class="etiqueta">    Solo seleccionados:</label>    <span>    <input name="selected" data-dojo-type="dijit/form/CheckBox" value="true" checked />   </span>   </div>  <input data-dojo-type="dijit/form/TextBox" type="hidden" id="' + t._internal_id('idevents') + '" value="-1" name="idevents"  />  <input data-dojo-type="dijit/form/TextBox" id="' + t._internal_id('tg') + '" type="hidden" name="type_grid" value="-2" /> </br>  <button data-dojo-type="dijit/form/Button" type="submit" value="Aceptar">Aceptar</button> </div> ';

//console.log(formexportcsv);

            var myDialogExportCSV = new TtD({
                content: formexportcsv,
                onMouseLeave: function () {
                    popup.close(myDialogExportCSV);
                }
            });

            on(t.csv, 'click', function () {
                var input_idevents = dijit.byId(t._internal_id('idevents'));
                input_idevents.set('value', t.DataGrid.Grid.RowSelected.toString());
                var input_type_grid = dijit.byId(t._internal_id('tg'));
                input_type_grid.set('value', t.type_grid);
                popup.open({
                    popup: myDialogExportCSV,
                    around: t.csv.domNode
                });
            });


//********************************************************//

            var myDialogDisableUpdateEvents = new CTtD({
                content: ' <div style="width: 100px; height: auto;">Esta accion desactivará la actualización automática de los registros de la tabla por ' + t._time_disable_upload_events + ' segundos, desea continuar?</div>',
// style: "width: 100px;",
                onCancel: function () {
                    t._temp_time_disable_upload_events = 3;
                    popup.close(myDialogDisableUpdateEvents);
                },
                onExecute: function () {
                    t._temp_time_disable_upload_events = t._time_disable_upload_events;
                    popup.close(myDialogDisableUpdateEvents);
                }
            });

            on(t.disable_autoupload_events, 'click', function () {
                popup.open({
                    popup: myDialogDisableUpdateEvents,
                    around: t.disable_autoupload_events.domNode
                });
            });




//**********************************************************//
            var myDialogCommentEventSelection = new TtD({
                content: ' <div id="' + t._internal_id('ce_selection') + '" data-dojo-type="woams_event_comment_insert/woams_event_comment_insert" style="width: 100%; height: auto;"></div> ',
                style: "width: 75%",
                onMouseLeave: function () {
                    popup.close(myDialogCommentEventSelection);
                }
            });

            on(t.comment_selection, 'click', function () {

                var cs = dijit.byId(t._internal_id('ce_selection'));
                cs.set('idevent', t.DataGrid.Grid.RowSelected);

                popup.open({
                    popup: myDialogCommentEventSelection,
                    around: t.comment_selection.domNode
                });
            });




//*********************************************************//


            t.DataGrid.create_grid(1);
            t.DataGrid.on('onitemclick', function (e) {
//t.new_comment.idevent = e.idevent;
//console.log(e);
                t.ContentPaneComments̈́.set('title', e.dateevent + ' [' + e.account_name + '] => ' + e.label);
                t.Comments.load(e.idevent);
                t.AddComment.set('idevent', e.idevent);
            });


            t.AddComment.on('onsavecomment', function (e) {
                t.TPaneAddComment.set('open', false);
                t.Comments.load(e.idevent);
            })



            setInterval(function () {

                if (t._temp_time_disable_upload_events > 0) {
                    t._temp_time_disable_upload_events--;
                    t.ContentPaneEvents.set('title', 'PANEL DE EVENTOS [Actualizacion automática se habilitará en ' + t._temp_time_disable_upload_events + ' segundos]');
                } else {
//t.disable_autoupload_events = false;
                    t.ContentPaneEvents.set('title', 'PANEL DE EVENTOS [Actualizacion automática habilitada]');
                }

            }, 1000);

        },
        _internal_id: function (_nameid) {
            return this._base_id + '_' + _nameid;
        },
        resize: function () {
            this.Accordion.resize();
            this.DataGrid.resize();
//this.BC.resize();
//this.AccordionComments.resize();
        },
        load: function (_idaccount) {
            var t = this;
            if (t._temp_time_disable_upload_events == 0) {
                t._idaccount = _idaccount;
                console.log("Cargar eventos con cuenta " + _idaccount);
                t.DataGrid.load(_idaccount);
//var eview = dijit.byId(t._ideview);
//eview.set('idaccount', _idaccount);
//t.new_comment.idevent = -1;
            } else {
//console.log('Esta en estado '+ t._disable_autoupload_events);
            }
        },
        create_grid: function (type_grid) {
            this.type_grid = type_grid;
            this.DataGrid.create_grid(this.type_grid);
        }





    });
});
