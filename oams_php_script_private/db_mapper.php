<?php

ini_set('display_errors', 1);
require_once "oams_db.php";

    $db = new oamsDB();
    $db->connect();
   $db->mapper_table();

/*
$host = "localhost";
$dbname = "open_ams";

$dbconn = pg_connect("host=".$host." port=5432 dbname=".$dbname." user=postgres password=pg1234")  or die("Could not connect");
$table = array();
*/

$result_list_tables = pg_query_params($db->connection, "SELECT * from oams_table_columns ORDER BY table_name, column_name;", array());

$dbname = "open_ams";
$namevardb = "_DBMAP_".$dbname;
$outphp = "<?php  \n\r".'$'.$namevardb.' = array()'.";\n";

$jsw = "width: 'auto'";

$gstructuresjs = "define(\"oams/grid_structures/XXXTABLEXXX\",['dojo/_base/declare', 'dojo/Evented'],function(_1, _2){

  return _1([_2], {
	structure: XXXSTRUCTUREXXX

});


});";
$gstructures = array();

while ($row = pg_fetch_array($result_list_tables , null, PGSQL_ASSOC)){ 

$outphp = $outphp.'$'.$namevardb.'["'.$row["table_name"].'"]["'.$row["column_name"].'"] = "'.$row["data_type"]."\";\n";
$outphp = $outphp.'$'.$namevardb.'["'.$row["table_name"].'"]["'.$row["column_name"].'"]["label"] = "'.$row["column_label"]."\";\n";
$gs = "";

switch($row["data_type"]){
	case "timestamp without time zone":
$jsw = "width: '90px'";
$gs = $row["column_name"].": {r: ". "{field:'".$row["column_name"]."', dataType: 'datetime',  name:'".$row["column_label"]."'}, ";
$gs = $gs." w: "."{field:'".$row["column_name"]."', dataType: 'datetime', name:'".$row["column_label"]."'}}";

	break;
	case "boolean":
$jsw = "width: '50px'";
$gs = $row["column_name"].": {r: ". "{field:'".$row["column_name"]."', ".$jsw.", editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: \"true\"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true,  name:'".$row["column_label"]."'}, ";
$gs = $gs." w: "."{field:'".$row["column_name"]."', ".$jsw.", editor: 'dijit/form/CheckBox', editorArgs: {props: 'value: true, disabled: \"false\"', fromEditor: function (d){return d;}, toEditor: function(storeData, gridData){ return gridData;}}, alwaysEditing: true, name:'".$row["column_label"]."'}}";

	break;

/*
			{field:"es_franquicia", name: "Franquicia",  width: '50px', editor: "dijit/form/CheckBox", editorArgs: {props: 'value: true, disabled: "true"',
				fromEditor: function (d){
		return d;
	},
toEditor: function(storeData, gridData){
return gridData;
				}}, alwaysEditing: true},
*/


	default:
$gs = $row["column_name"].": {r: ". "{field:'".$row["column_name"]."', name:'".$row["column_label"]."'}, ";
$gs = $gs." w: "."{field:'".$row["column_name"]."', name:'".$row["column_label"]."'}}";
	break;

}

if(!array_key_exists($row["table_name"], $gstructures)){
$gstructures[$row["table_name"]] = array();
array_push($gstructures[$row["table_name"]], $gs);

}else{
array_push($gstructures[$row["table_name"]], $gs);
}

}

$outphp = $outphp."\n\r?>";

foreach($gstructures as $k=>$v){
$tabla = $k;
$a = str_replace("XXXTABLEXXX", $tabla, $gstructuresjs);
$b = str_replace("XXXSTRUCTUREXXX", "{".implode(",\n", $v)."}\n\r", $a);

$mystructure = fopen("../lib/dojo/oams/grid_structures/".$tabla.".js", "w") or die("Unable to open file!");
fwrite($mystructure, $b);
fclose($mystructure);
}

$myfile = fopen($namevardb.".php", "w") or die("Unable to open file!");
fwrite($myfile, $outphp);
fclose($myfile);




?>
