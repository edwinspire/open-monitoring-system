/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']
require(["dojo/ready",  
"dojo/on",
"dojo/data/ItemFileWriteStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
  "dijit/form/NumberTextBox",
"gridx/modules/VirtualVScroller",
"dojo/request",
"jspire/request/Xml",
"jspire/Gridx",
"dojox/grid/cells/dijit",
"gridx/modules/RowHeader",
"gridx/modules/select/Row",
"gridx/modules/IndirectSelect",
"gridx/modules/extendedSelect/Row",
"dijit/TooltipDialog",
"dijit/popup"
], function(ready, on, ItemFileWriteStore, Grid, Async, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller, request, RXml, jsGridx) {
	ready(function() {
		// logic that requires that Dojo is fully initialized should go here
		dijit.byId('idTitle').set('label', 'Grupos');
		var GridGroups = dijit.byId('idGridGroups');
		GridGroups.load();
		var Menu = dijit.byId('id_menu_general');
		Menu.deleteButtonSave();
		Menu.on('ondelete', function() {
			GridGroups.delete();
		}
		);
		var MH = dijit.byId('idMH');
		MH.on('onchangedgroupstable', function() {
			GridGroups.load();
		}
		);
		var formadd = dijit.byId('id_dialog_form');
		formadd.byes.set('label', 'Guardar');
		formadd.bno.set('label', 'Cancelar');
		formadd.innerHTML('<form id="idformnew">  <table border="0" style="border-collapse: collapse; table-layout: auto; width: 100%; height: 100%;">    <colgroup>      <col></col>      <col></col>    </colgroup>    <tbody>      <tr>        <td>          <label style="margin-right: 3px;">            Habilitado:</label>        </td>        <td>          <input type="checkbox" data-dojo-type="dijit/form/CheckBox" id="idenable" intermediateChanges="false" iconClass="dijitNoIcon" checked="true"></input>        </td>      </tr>      <tr>        <td>          <label style="margin-right: 3px;">            Nombre:</label>        </td>        <td>          <input type="text" data-dojo-type="dijit/form/TextBox" id="idname" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false"></input>        </td>      </tr>      <tr>        <td>          <label style="margin-right: 20px;">            Nota:</label>        </td>        <td>         </td>      </tr>    </tbody>  </table>  <textarea type="text" data-dojo-type="dijit/form/Textarea" id="idnote" intermediateChanges="false" rows="3" trim="false" uppercase="false" lowercase="false" propercase="false" style="height: auto; width: 100%;"></textarea> </form>');
		formadd.dijitOwner(Menu.new, 'Click').on('onok', function() {
			//b.emit('onok', {});
			//console.log(formadd.idenable);
			GridGroups.save( {
				idgroup: 0, enable: dijit.byId('idenable').get('checked'), name: dijit.byId('idname').get('value'), note: dijit.byId('idnote').get('value'), ts: '1990-01-01'
			}
			);
		}
		);

	}
	);
}
);
