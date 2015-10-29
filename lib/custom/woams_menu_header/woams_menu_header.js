/* global EventSource, dojo */

define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!woams_menu_header/woams_menu_header.html',
    'dojo/request',
    'w_common_notification_area/w_common_notification_area',
    'dijit/MenuBar',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuBarItem'
], function (declare, _Widget, _Templated, templateString, R) {

    return declare([_Widget, _Templated], {
        widgetsInTemplate: true,
        templateString: templateString,
        _lastidnotify: 0,
        _tempts: {},
        postCreate: function () {

            var t = this;

            t.on("sse_onchanged_table", function (e) {
                //   console.log(e);
                if (e.table_name == "notification_area") {
//console.log(' get_not'); jspire/request/dbTuple
                    t._get_notify();
                }

            });

            t.idmlogin.on('Click', function () {
                window.open("login.php", '_self');
            });

            t.idmlogout.on('Click', function () {
                window.open("login.php", '_self');
            });

            t.idmeventlog.on('Click', function () {
                window.open('index.php', '_self');
            });


            t.idmeventmanager.on('Click', function () {
                window.open("oams_event_admin.php", '_self');
            });
            /*
             t.idmeventmanagermobil.on('Click', function(){
             window.open("m_usaga_event_manager.php", '_self');
             });
             
             t.idmeventreport.on('Click', function(){
             window.open("usaga_reports.php", '_self');
             });
             */

            t.idmeventreportgeneral.on('Click', function () {
                window.open("oams_report_event_general.php", '_self');
            });


            t.idmaccountedit.on('Click', function () {
                window.open("oams_accounts.php", '_self');
            });


            t.idmcontacts.on('Click', function () {
                window.open("oams_contacts.php", '_self');
            });
            
             t.idmaccountmap.on('Click', function(){
             window.open("oams_map.php?maptype=0&with_contacts_users=false&with_menu=true",'_self');
             });

             
             t.idmrepadmin.on('Click', function(){
             window.open("oams_report_admin.php", '_self');
             });
             
             t.idmrepevents.on('Click', function(){
             window.open("oams_report_events.php",'_self');
             });
             
             t.idmrequipments.on('Click', function(){
             window.open("oams_report_equipments.php",'_self');
             });

             t.idmrequipmentsnetwork.on('Click', function(){
             window.open("oams_report_equipments_network.php",'_self');
             });

             
             t.idmadm.on('Click', function(){
             window.open("oams_admins.php",'_self');
             });

/*             
             t.idmeventtypes.on('Click', function(){
             window.open("usaga_eventtypes.php",'_self');
             });
             
             t.idmkeywords.on('Click', function(){
             window.open("usaga_keywords.php",'_self');
             });
             
             t.idmusms.on('Click', function(){
             window.open('usms.php','_blank');
             });
             
             t.idmaboutusaga.on('Click', function(){
             alert('En construccion');
             });
*/     

             t.idmtarjetaserrores.on('Click', function(){
             window.open("farma_tarjetas_errores.php",'_self');
             });        

             t.idmreload.on('Click', function(){
             window.location.reload(true);
             });
             
//t.on("onchangednotification_areatable", function(){
//t._get_notify();
//});

// Recibe la señal del servidor indicando que hubo algun cambio y la tabla debe actualizarse
            if (typeof (EventSource) !== "undefined")
            {
                var source = new EventSource("oams_php_query/sse_table_changed.php");

                source.onmessage = function (e) {
                   // console.warn(JSON.parse(e.data));
                    var tables = JSON.parse(e.data);
                    //t._tempts[tables.table] = tables.ts;
                    if (t._detect_table_changed(tables)) {
                        t.emit("sse_onchanged_table", tables);
                    }

                };

            } else {
// Esto aplica para navegadores que no tienen soporte para EventSource
                console.log("Sorry, your browser does not support server-sent events, using setInterval...");
//alert('El navegador No soporta EventSource');
                setInterval(function () {
                    t._table_change();
                }, 10000);
            }

        },
        _detect_table_changed: function (table_data) {
            var r = false;

            if (this._tempts[table_data.table_name] != table_data.ts) {
                r = true;
                this._tempts[table_data.table_name] = table_data.ts;
                // console.log(table_data.table_name);
            }

            return r;
        },
        _get_notify: function () {
            var t = this;
            R.post('oams_php_query/notifications.php', {
                // Parse data from xml
                data: {lastidnotify: t._lastidnotify},
                handleAs: "json"
            }).then(
                    function (response) {


                        dojo.forEach(response, function (item, i) {
                            var ix = Number(item.idnotify);
//console.log(ix+" ==> "+t._lastidnotify);
                            if (ix > t._lastidnotify) {
                                //  console.log('mh '+item.timeout);
//console.log('Deberia mostrar una notify');
                                t.notification.notify({message: item.body, title: item.title, img: item.img, snd: item.snd, timeout: item.timeout, urgency: item.urgency, closable: item.closable});
                                t._lastidnotify = ix;
                            }
                        });

                    },
                    function (error) {
                        // Display the error returned
                        t.notification.notify({message: error});
                    }
            );
        },
        _table_change: function () {
            var t = this;
            R.post('oams_php_query/sse_notsupport_table_changed.php', {
                // Parse data
                data: t._tempts,
                handleAs: "json"
            }).then(
                    function (response) {
//console.log('** _table_change ** '+response);
                        dojo.forEach(response, function (item, i) {
                            //console.log(item);
                            if (t._detect_table_changed(item)) {
                                t.emit("sse_onchanged_table", item);
                            }

                        });



                    },
                    function (error) {
                        // Display the error returned
                        t.notification.notify({message: error});
//setTimeout(t._get_notify(), 10000);
                    }
            );
        }



    });
});
