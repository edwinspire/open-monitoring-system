<?php

ini_set('display_errors', 0);
//include_once("_DBMAP_open_ams.php");
$oams_config = parse_ini_file("oams.ini.php");

/** Include PHPExcel_IOFactory */
require_once dirname(__FILE__) . '/PHPExcel/Classes/PHPExcel/IOFactory.php';
require_once dirname(__FILE__) . '/PHPExcel/Classes/PHPExcel.php';

class pguDC {

    // Declaración de la propiedad
//    private $conn_string = "host=localhost port=5432 dbname=open_ams user=postgres password=pg1234";
public $host="localhost";
public $port=5432;
public $dbname="oams";
public $user="postgres";
public $password="pg1234";
public $catalog="";
    public $connection = null;
	public $idadmin = -100;
public $Columns = array();

public $table_name = "";


public static function column_label($table, $column){
$r = "";

$db = new pguDC();
$db->connect($table);

if(strlen($db->table_name) > 0){

$query = "SELECT column_label FROM udc_tables_columns WHERE table_name = $1::TEXT AND column_name = $2::TEXT LIMIT 1;";
$data = array($db->table_name, $column);

$sc = pg_query_params($db->connection, $query, $data);

while($row = pg_fetch_array($sc)) {
$r = $row["column_label"];
} 

}

return $r;
}

   function __destruct() {
       pg_close ($this->connection);
   }

public function login() {

    $Retorno = false;
// Devuelve true si no se ha solicitado loguearse
    if (isset($_POST['oams_submit'])) {

        /* Check and assign submitted Username and Password to new variable */
        $user = isset($_POST['oams_user']) ? $_POST['oams_user'] : 'anonymous';
        $pwd = isset($_POST['oams_pwd']) ? $_POST['oams_pwd'] : '';

        $result = pg_query_params($this->connection, "SELECT login, username, sessionid, fullname, msg FROM fun_login($1::text, $2::text, $3::text, $4::text);", array($user, $pwd, $_SERVER['HTTP_USER_AGENT'], $_SERVER['REMOTE_ADDR']));
        $row = pg_fetch_assoc($result);
//print_r($row);
        if ($row["login"] == "t") {
            $Retorno = true;
		setcookie("oams_fullname", $row["fullname"], (time()+3600)*8);  /* expira en 8 hora */
		setcookie("oams_username", $row["username"], (time()+3600)*8);  /* expira en 8 hora */
		setcookie("oams_sessionid", $row["sessionid"], (time()+3600)*8);  /* expira en 8 hora */
        }
    }

    return $Retorno;
}


public function  access_control($level){
// session_start();
$r = $this->admin_signed(false);
if($r){
// Aca completamos con la verificacion del nivel de acceso
}

return $r;
}

public function logout() {

    if (isset($_COOKIE['oams_username'])) {
        $result = pg_query_params($this->connection, "SELECT fun_logout($1::bigint, $2::text) as result;", array($_COOKIE['oams_username'], $_COOKIE['oams_sessionid'])); //$_SERVER['HTTP_USER_AGENT'], $_SERVER['REMOTE_ADDR'], session_id()  
    }

	setcookie("oams_fullname", "anonymous", time()+1);
	setcookie("oams_username", "anonymous", time()+1);
	setcookie("oams_sessionid", "anonymous", time()+1);

}


    public function admin_signed($return_401 = true) {
$r = false;
$this->idadmin = -100;
//print_r($_COOKIE);
if(isset($_COOKIE['oams_sessionid']) && isset($_COOKIE['oams_username'])){
//echo "Variables deficnidas </br>";
        $result = pg_query_params($this->connection, "SELECT idadmin FROM admins WHERE admin_username = $1::text AND admin_sessionid= $2::TEXT AND admin_ip = $3::TEXT;", array($_COOKIE['oams_username'], $_COOKIE['oams_sessionid'], $_SERVER['REMOTE_ADDR']));
        $row = pg_fetch_assoc($result);
//print_r($row);
        if ($row["idadmin"] > 0) {
		$this->idadmin = $row["idadmin"];
            $r = true;
        }else{
if($return_401){
            header('HTTP/1.1 401 Unauthorized', true, 401);
            exit();
}
}
}else{
if($return_401){
            header('HTTP/1.1 401 Unauthorized', true, 401);
            exit();
}
}

return $r;
    }


public static function result_to_csv($table_name, $result) {
    $arr = array();

    if (!$result) {
        echo pg_last_error($result);
        echo pg_result_error($result);
    } else {

    $arr = pg_fetch_all($result);

if(is_array($arr)){
    $this->result_array_normalize($arr);
}else{
    $arr = array();
}

    }

    $h = array();

    foreach ($arr[0] as $k => $v) {

if(isset($GLOBALS["dbmap_open_ams"][$table_name][$k]["label"])){
        array_push($h, strtoupper($GLOBALS["dbmap_open_ams"][$table_name][$k]["label"]));
}else{
        array_push($h, strtoupper($k));
}

    }

    $r = oamsDB::arrayToCsv($h);

    foreach ($arr as $row) {
        $r = $r . "\n\r" . oamsDB::arrayToCsv($row);
    }

    return $r;
}


static function arrayToCsv(array &$fields, $delimiter = ';', $enclosure = '"', $encloseAll = false, $nullToMysqlNull = false) {
    $delimiter_esc = preg_quote($delimiter, '/');
    $enclosure_esc = preg_quote($enclosure, '/');

    $output = array();
    foreach ($fields as $field) {
        if ($field === null && $nullToMysqlNull) {
            $output[] = 'NULL';
            continue;
        }
        // Enclose fields containing $delimiter, $enclosure or whitespace
        if ($encloseAll || preg_match("/(?:${delimiter_esc}|${enclosure_esc}|\s)/", $field)) {
            $output[] = $enclosure . str_replace($enclosure, $enclosure . $enclosure, $field) . $enclosure;
        } else {
            $output[] = $field;
        }
    }

    return implode($delimiter, $output);
}



function result_array_normalize(&$array_result){

foreach ($array_result as &$row) {
//print_r($row);
foreach ($row as $k => &$v) {

if(isset($this->Columns[$k]["data_type"])){
// En esta parte convertimos los valores boleanos devueltos por postgres a boleanos validos para json
switch($this->Columns[$k]["data_type"]){
	case 'boolean':
if($v == 't'){
$v = true;
}else{
$v = false;
}
break;
default:
// No cambia nada
break;

}
}  

}

}
return $array_result;
}



public static function result_to_json($table_name, $result) {

    $arr = array();

    if (!$result) {
        echo pg_last_error($result);
        echo pg_result_error($result);
    } else {

    $arr = pg_fetch_all($result);

if(is_array($arr)){
    pguDC::result_array_normalize($table_name, $arr);
}else{
    $arr = array();
}
	


    }

    return json_encode($arr);
}





    // Declaración del método
    public function connect($table = "") {

 global $oams_config;

if(isset($oams_config["host"])){
$this->host = $oams_config["host"];
}

if(isset($oams_config["port"])){
$this->port = $oams_config["port"];
}

if(isset($oams_config["dbname"])){
$this->dbname = $oams_config["dbname"];
}

if(isset($oams_config["user"])){
$this->user = $oams_config["user"];
}

if(isset($oams_config["password"])){
$this->password = $oams_config["password"];
}

if(isset($oams_config["catalog"])){
$this->catalog = $oams_config["catalog"];
}

        $this->connection = pg_connect("host=".$this->host." port=".$this->port." dbname=".$this->dbname." user=".$this->user." password=".$this->password) or die("Could not connect with DB - host=".$this->host." port=".$this->port." dbname=".$this->dbname." user=".$this->user);

// Si el usuario ingresa 
if(strlen($table) > 0){
$this->table_name = $table;
}else{
//echo "No ha ingresado la table con la que se va a trabajar\n";
}

// Si hay ingresada un tabla se usará para mapearla
$this->use_table($this->table_name);

	return $this->connection;
    }

public function use_table($table){
if(strlen($table) > 0){
$this->table_name = $table;
$query = "SELECT column_name, data_type, column_label FROM udc_tables_columns WHERE table_name = $1::TEXT;";
$data = array($this->table_name);

$sc = pg_query_params($this->connection, $query, $data);

while($row = pg_fetch_array($sc)) {
//$this->Columns[$row["column_name"]] = $row["data_type"];
$this->Columns[$row["column_name"]] = array("data_type" => $row["data_type"], "column_label" => $row["column_label"]);
} 

}
}


// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente
    public function insert($data, $ignore_data = array()) {
$dt = $this->buid_data_and_type_array($data, $ignore_data);
$q = "INSERT INTO ".$this->table_name." (".implode(', ', $dt["fields"]).") VALUES (".implode(' ,', $dt["types"]).")";
//echo $q;
$rq = pg_query_params($this->connection, $q, $dt["datas"]);
return pg_affected_rows($rq);
    }

// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente
    public function insert_result_as_json($data, $ignore_data = array()) {
$r = $this->insert($data, $ignore_data);
if($r < 1){
$r = -1;
}
//return "{\"insert\": \"".$r."\", \"error\": \"".pg_last_error($this->connection)."\", \"notice\": \"".pg_last_notice($this->connection)."\"}";
return json_encode(array("insert"=>$r,  "error"=>pg_last_error($this->connection), "notice"=>pg_last_notice($this->connection)));
    }


public function buid_data_and_type_array($data, $ignore_data = array()){

$data = $this->data_to_array($data, $ignore_data);

$r = array();
$r["datas"] = $data;
$r["fields"] = array_keys($data);
$r["types"] = array();
$r["datatypes"] = array();
$i = 1;
        foreach ($data as $field => $v) {

            if (array_key_exists($field, $this->Columns)) {
$t = $this->Columns[$field]["data_type"];
              array_push($r["types"], "$" . $i . "::" . $t);
		array_push($r["datatypes"], $field."=$" . $i . "::" . $t);
            }else{
              array_push($r["types"], "$" . $i . "::TEXT");
		array_push($r["datatypes"], $field."=$" . $i . "::TEXT");
}
                $i++;
        }
return $r;
}

public function data_to_array($data, $ignore_data = array()) {

        $d = array();

        foreach ($data as $k => $v) {
                    if (array_key_exists($k, $this->Columns) && !in_array($k, $ignore_data)) {
                        $d[$k] = $v;
                    }
            }
//print_r($d);
return $d;
    }



// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente, $where un array con los nombres de los campos para hacer where
    public function update($data, $where, $ignore_data = array(), $require_where = true) {

// Hacemos que automaticamente ignore las llaves del where
$ignore_data = array_unique(array_merge(array_keys($where), $ignore_data));
//print_r($ignore_data);
$dt_data = $this->data_to_array($data, $ignore_data); 
$dt_where = $this->data_to_array($where);

//print_r($dt_data);
//print_r($dt_where);

$dt = $this->buid_data_and_type_array(array_merge($dt_data, $dt_where));

$set = array_slice($dt["datatypes"], 0, count($dt_data));

$query = "";

if($require_where){
//print_r($dt_where);
if(count($dt_where) > 0){
$w = array_slice($dt["datatypes"], count($dt_data), count($dt_where));
$query = "UPDATE ".$this->table_name." SET ".implode(', ', $set)." WHERE ".implode(', ', $w);
}else{
echo "Error la sentencia where es requerida";
}

}else{
$query = "UPDATE ".$this->table_name." SET ".implode(', ', $set);
}

//echo $query."\n\r";
$rq = pg_query_params($this->connection, $query, $dt["datas"]);
return pg_affected_rows($rq);
    }

    public function update_resutl_as_json($data, $where, $ignore_data = array(), $require_where = true) {
$r = $this->update($data, $where, $ignore_data, $require_where);
if($r < 1){
$r = -1;
}
//return "{\"update\": \"".$r."\", \"error\": \"".pg_last_error($this->connection)."\", \"notice\": \"".pg_last_notice($this->connection)."\"}";
return json_encode(array("update"=>$r,  "error"=>pg_last_error($this->connection), "notice"=>pg_last_notice($this->connection)));
    }

// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente, $where un array con los nombres de los campos para hacer where
    public function build_query_select($return_fields = array(), $where = array(), $orderby="", $limit = 0, $and_field_any = "", $and_values_any = array()) {

        $fields = array();
        $w = array();
        $datas = array();
        $i = 1;

//print_r($this->Columns);

        foreach ($this->Columns as $k => $v) {

     if (in_array($k, $return_fields)) {
                array_push($fields, $k);
            }   
    
            if (array_key_exists($k, $where)) {
                array_push($w, $k . "=$" . $i . "::" . $v["data_type"]);
                array_push($datas, $where[$k]);
                $i++;
            }
        }

        $query = "SELECT ";

        if (count($fields) > 0) {
            $query = $query . implode(', ', $fields);
        } else {
            $query = $query . " * ";
        }

        $query = $query . " FROM " . $this->table_name;

        if (count($w) > 0) {
            $query = $query . " WHERE " . implode(', ', $w);
$i++;
        }

//echo array_key_exists($and_field_any, $this->Columns)." Existe\n\r";
//echo count($and_values_any)." Ids\n\r";
if(array_key_exists($and_field_any, $this->Columns) && count($and_values_any) > 0){

        if (count($w) > 0) {
 $query = $query." AND ".$and_field_any." = ANY($".$i."::".$this->Columns[$and_field_any]["data_type"]."[]) ";
        }else{
 $query = $query." WHERE ".$and_field_any." = ANY($".$i."::".$this->Columns[$and_field_any]["data_type"]."[]) ";
}

array_push($datas, "{".implode(",", $and_values_any)."}");
}

if(strlen($orderby) > 0){
 $query = $query . " ORDER BY " . $orderby;
}

        if ($limit > 0) {
            $query = $query . " LIMIT " . $limit;
        }
//echo $query;
return array("query"=>$query, "datas"=>$datas);
    }


public function select($return_fields = array(), $orderby="", $limit = 0){
return $this->select_where($return_fields, array(), $orderby, $limit);
}

public function query_params($query, $param){
//echo $query;
return pg_query_params($this->connection, $query, $param);
}

public function select_where($return_fields = array(), $where = array(), $orderby="", $limit = 0){
$d = $this->build_query_select($return_fields, $where, $orderby, $limit);
//return pg_query_params($this->connection, $d["query"], $d["datas"]);
return $this->query_params($d["query"], $d["datas"]);
}

/*
public function query_result_as_json($data, $return_fields = array(), $where = array(), $orderby="", $limit = 0){
$result = json_encode(array("error"=>"",  "notice"=>"Ninguna accion realizada "));
        switch ($_data["udc_action"]) {
case "select":
$result = $db->select_where_result_as_json(array(), array($_data["udc_referential_field"]=>$_data[$_data["udc_referential_field"]]));
break;
case "update":
$result = $db->update_resutl_as_json($_data, array($_data["udc_referential_field"]=>$_data[$_data["udc_referential_field"]]), array("ts"));
break;
case "insert":
$result = $db->insert_result_as_json($_data);
break;
case "delete":
//$result = $db->select_result_as_json();
break;
case "delete_selection":
$result = $db->delete_selection_result_as_json($_data["udc_referential_field"], $_data["udc_selected_id"]);
break;
default:
$result = json_encode(array("error"=>"",  "notice"=>"udc_action ".$_data["udc_action"]." no es reconocido"));
break;
}

return $result;
}
*/

    public function delete_result_as_json($where = array(), $require_where = true) {
$r = $this->delete($where, $require_where);
if($r < 1){
$r = -1;
}
//return "{\"delete\": \"".$r."\", \"error\": \"".pg_last_error($this->connection)."\", \"notice\": \"".pg_last_notice($this->connection)."\"}";
return json_encode(array("delete"=>$r,  "error"=>pg_last_error($this->connection), "notice"=>pg_last_notice($this->connection)));
    }

// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente, $where un array con los nombres de los campos para hacer where
    public function delete($where = array(), $require_where = true) {

$r = false;

if($require_where){

if(count($where) > 0){
$r = pg_delete($this->connection, $this->table_name, $where);
}

}else{
$r = pg_delete($this->connection, $this->table_name, $where);
}

return $r;
    }


    public function delete_selection_result_as_json($field, $values = array()) {
return json_encode(array("delete"=>$this->delete_selection($field, $values),  "error"=>pg_last_error($this->connection), "notice"=>pg_last_notice($this->connection)));
}


    public function delete_selection($field, $values = array()) {
$r = pg_query_params($this->connection, "DELETE FROM ".$this->table_name." WHERE ".$field." = ANY($1::".$this->Columns[$field]["data_type"]."[])", array("{".implode(", ",$values)."}"));
return pg_affected_rows($r);
    }


public function query_params_result_as_json($query, $params){
$q = "select array_to_json(array_agg(row_to_json(t))) FROM (".$query.") t;";
$r = pg_query_params($this->connection, $q, $params);
return pg_fetch_assoc($r)["array_to_json"];
}


public  function select_result_as_json($return_fields = array(), $orderby="", $limit = 0){
return $this->select_where_result_as_json($return_fields, array(), $orderby, $limit);
}

public  function select_where_result_as_json($return_fields = array(), $where = array(), $orderby="", $limit = 0){
$d = $this->build_query_select($return_fields, $where, $orderby, $limit);
return $this->query_params_result_as_json($d["query"], $d["datas"]);
}

public  function select_result_as_csv($return_fields = array(), $where = array(), $orderby="", $limit = 0){
return oamsDB::result_to_csv($this->table_name, $this->select($return_fields, $where, $orderby, $limit));
}

public static function html_tag_option_values($query){
$r = "";
$db = new pguDC();
$db->connect();

$result = pg_query($db->connection, $query);

while ($row = pg_fetch_array($result)) 
{ 
     $r = $r."<option value=\"".$row["id"]."\">".$row["name"]."</option>\n"; 
}
return $r;
}

}






//////////////////////////////////////////
class pguDCGrid extends pguDC {


public function structure($fields){

$rstructure = "[]";

$f = array_keys($fields);
$fields_as_string = implode(",", $f);

$result_field = pg_query_params($this->connection, "SELECT * FROM udc_tables_columns WHERE table_name = $1::TEXT AND column_name = ANY($2::TEXT[]);", array($this->table_name, "{".$fields_as_string."}"));

$columns = array();
$functions = array();

while ($row = pg_fetch_array($result_field , null, PGSQL_ASSOC)){ 

// Verificamos que el campo actual esta entre los solicitados
if(array_key_exists($row["column_name"], $fields)){

$randfunction = $row["column_name"]."_".microtime()."_".rand(0, 100);

// Busca en que posicion va a aparecer el campo
$colpos = array_search($row["column_name"], $f);

if($colpos >= 0){

if(strlen($row["column_width"])>0){
$jsw = $row["column_width"];
}else{
$jsw = "auto";
}

//echo "que sera esto" .$fields[$row["column_name"]]."\n";

$editable = false;
if($fields[$row["column_name"]] === "true"){
$editable = true;
}

//echo $editable." es \n";

$jsstructure = array();

$jsstructure['field'] = $row["column_name"];
$jsstructure['name'] = $row["column_label"];

if(strlen($row["column_class"]) > 0){
$jsstructure['class'] = $randfunction.'class';
$functions[$randfunction.'class'] = $row["column_class"];
}

switch($row["data_type"]){
	case "timestamp without time zone":

$datepattern = "yyyy-MM-dd HH:mm:ss";

if($jsw === "auto"){
$jsw = "80px";
}


$decorator = "function(value){ 
 try { 
   if (value) {

 var patt1 = /([\d]+)\-([\d]+)\-([\d]+)T([\d]+):([\d]+):([\d]+)(\.[\d]+)*/; 
    var result = value.match(patt1);

   var dt = new Date(result[1], result[2]-1, result[3], result[4], result[5], result[6]); 
return dojo.date.locale.format(dt, { selector: \"date\", datePattern: \"".$datepattern."\"});   
  }
  } catch (e) {
    console.error('error decorating date: ' + e.toString()); 
console.error(value);
 } }";
 

$jsstructure['dataType'] = 'datetime';
$jsstructure['decorator'] = $randfunction.'decorator';
$functions[$randfunction.'decorator'] = $decorator;

if($editable){
$jsstructure['editable'] = true;
}

	break;
	case "boolean":

if($jsw == "auto"){
$jsw = "50px";
}

$jsstructure['dataType'] = 'boolean';
$jsstructure['editor'] = 'dijit/form/CheckBox';
$jsstructure['alwaysEditing'] = true;

if($editable){
$jsstructure['editorArgs'] = array("props"=>"value: true");
}else{
$jsstructure['editorArgs'] = array("props"=>"value: true, disabled: true");
$jsstructure['editable'] = true;
}

	break;

	default:
$jsstructure['editable'] = $editable;
	break;
}

$jsstructure['width'] = $jsw;

$columns[$colpos] = $jsstructure;

}

}

}


ksort($columns);

$jsoncolumns = array();

foreach($columns as $col){
array_push($jsoncolumns, json_encode($col));
}

$jsonreturn = "[".implode(",\n", $jsoncolumns)."]";

foreach($functions as $k => $v){
$jsonreturn = str_replace('"'.$k.'"', $v, $jsonreturn);
}

//echo $jsonreturn;
return $jsonreturn;
}


public function select_where_as_html_table($header = true, $title = "", $return_fields = array(), $where = array(), $orderby="", $limit = 0){
return $this->result_as_html_table($this->select_where($return_fields, $where, $orderby, $limit), $header, $title);
}


public function query_as_html_table($query, $param, $header = true, $title = ""){
return $this->result_as_html_table($this->query_params($query, $param), $header, $title);
}

public static function xlsx_get_vector($column, $row){

$c = array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ");

return $c[$column]."".$row;
}


public function export_as_xlsx($header = true, $title = "", $return_fields = array(), $where = array(), $orderby="", $limit = 0, $and_field_any = "", $and_values_any = array()){
$d = $this->build_query_select($return_fields, $where, $orderby, $limit, $and_field_any, $and_values_any);
return $this->result_as_xlsx($this->query_params($d["query"], $d["datas"]), $header, $title);
}

public function result_as_xlsx($result, $header = true, $title = ""){

    $arr = array();

$file_name_export = tempnam(sys_get_temp_dir(), 'report.xlsx');

    if (!$result) {
        echo pg_last_error($result);
        echo pg_result_error($result);
    } else {


$cellcmin = 0;
$cellrmin = 1;
$cellcmax = 0;
$cellrmax = 1;


$cellc = 0;
$cellr = 1;


//$r = $r."\n\r<table id=\"".$id."\" class=\"tftable\" border=\"1\">\n\r";

    $arr = pg_fetch_all($result);

//print_r($arr);
if(is_array($arr)){
    $this->result_array_normalize($arr);
}else{
    $arr = array();
}

    }

    $h = array();




error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

date_default_timezone_set('Europe/London');

//include "ExportToXLS.inc.php";

/** Include PHPExcel */
//require_once dirname(__FILE__) . '/Classes/PHPExcel.php';


// Create new PHPExcel object
//echo date('H:i:s') , " Create new PHPExcel object" , EOL;
$objPHPExcel = new PHPExcel();

// Set document properties
//echo date('H:i:s') , " Set document properties" , EOL;
$objPHPExcel->getProperties()->setCreator("Open AMS")
							 ->setLastModifiedBy("Edwin De La Cruz")
							 ->setTitle("Office 2007 XLSX Test Document")
							 ->setSubject("Office 2007 XLSX Test Document")
							 ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
							 ->setKeywords("office 2007 openxml php")
							 ->setCategory("Report Open AMS");


// Create a first sheet, representing sales data
//echo date('H:i:s') , " Add some data" , EOL;


$objPHPExcel->setActiveSheetIndex(0);
$celltitle = pguDCGrid::xlsx_get_vector($cellc, $cellr);
if(strlen($title) > 0){
$objPHPExcel->getActiveSheet()->setCellValue($celltitle, $title);
$objPHPExcel->getActiveSheet()->getStyle($celltitle)->getFont()->setSize(15);
$objPHPExcel->getActiveSheet()->getStyle($celltitle)->getFont()->setBold(true);
$cellr++;
}

$cellr++;
$cellrmin = $cellr;

if($header){
$cellc = 0;
//$cellr = 1;
foreach($arr[0] as $k => $v){

if (array_key_exists($k, $this->Columns)) {
//$r = $r."	<th>".strtoupper($this->Columns[$k]["column_label"])."</th>\n";
$objPHPExcel->getActiveSheet()->setCellValue(pguDCGrid::xlsx_get_vector($cellc, $cellr), strtoupper($this->Columns[$k]["column_label"]));
}else{
//$r = $r."	<th>[".strtoupper($k)."]</th>\n";
$objPHPExcel->getActiveSheet()->setCellValue(pguDCGrid::xlsx_get_vector($cellc, $cellr), strtoupper("[".strtoupper($k)."]"));
}
$cellc++;
}

// Set style for header row using alternative method
//echo date('H:i:s') , " Set style for header row using alternative method" , EOL;
$objPHPExcel->getActiveSheet()->getStyle(pguDCGrid::xlsx_get_vector(0, $cellr).":".pguDCGrid::xlsx_get_vector($cellc-1, $cellr))->applyFromArray(
		array(
			'font'    => array(
				'bold'      => true
			),
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_RIGHT,
			),
			'borders' => array(
				'allborders'     => array(
 					'style' => PHPExcel_Style_Border::BORDER_THIN
 				)
			),
			'fill' => array(
	 			'type'       => PHPExcel_Style_Fill::FILL_GRADIENT_LINEAR,
	  			'rotation'   => 90,
	 			'startcolor' => array(
	 				'argb' => 'FFFFFF00'
	 			),
	 			'endcolor'   => array(
	 				'argb' => 'FFFFFFFF'
	 			)
	 		)
		)
);
//$cellr++;
}


    foreach ($arr as $row) {
$cellc = 0;
$cellr++;
foreach($row as $v){
$objPHPExcel->getActiveSheet()->setCellValue(pguDCGrid::xlsx_get_vector($cellc, $cellr), strip_tags(str_replace("</br>", "\n", $v)));
$cellc++;
if($cellc > $cellcmax){
$cellcmax = $cellc;
}
}

    }

if(strlen($title) > 0){
$objPHPExcel->getActiveSheet()->mergeCells($celltitle.':'.pguDCGrid::xlsx_get_vector($cellcmax-1, 1));
}


$cellrmax = $cellr;

$objPHPExcel->getActiveSheet()->getStyle(pguDCGrid::xlsx_get_vector(0, $cellrmin).":".pguDCGrid::xlsx_get_vector($cellcmax-1, $cellrmax))->applyFromArray(
		array(
			
			'borders' => array(
				'allborders'     => array(
 					'style' => PHPExcel_Style_Border::BORDER_THIN
 				)
			)
		)
);

// Set column widths
//echo date('H:i:s') , " Set column widths" , EOL;
$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('H')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('I')->setAutoSize(true);

/*
// Set fonts
echo date('H:i:s') , " Set fonts" , EOL;
$objPHPExcel->getActiveSheet()->getStyle('B1')->getFont()->setName('Candara');
$objPHPExcel->getActiveSheet()->getStyle('B1')->getFont()->setSize(20);
$objPHPExcel->getActiveSheet()->getStyle('B1')->getFont()->setBold(true);
$objPHPExcel->getActiveSheet()->getStyle('B1')->getFont()->setUnderline(PHPExcel_Style_Font::UNDERLINE_SINGLE);
$objPHPExcel->getActiveSheet()->getStyle('B1')->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_WHITE);

$objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_WHITE);
$objPHPExcel->getActiveSheet()->getStyle('E1')->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_WHITE);


$objPHPExcel->getActiveSheet()->getStyle('A18')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_JUSTIFY);
$objPHPExcel->getActiveSheet()->getStyle('A18')->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);

$objPHPExcel->getActiveSheet()->getStyle('B5')->getAlignment()->setShrinkToFit(true);

// Set thin black border outline around column
echo date('H:i:s') , " Set thin black border outline around column" , EOL;
$styleThinBlackBorderOutline = array(
	'borders' => array(
		'allborders' => array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
			'color' => array('argb' => 'FF000000'),
		),
	),
);
$objPHPExcel->getActiveSheet()->getStyle(pguDCGrid::xlsx_get_vector($cellcmin, $cellrmin).":".pguDCGrid::xlsx_get_vector($cellcmax, $cellrmax))->applyFromArray($styleThinBlackBorderOutline);



// Set fills
echo date('H:i:s') , " Set fills" , EOL;
$objPHPExcel->getActiveSheet()->getStyle('A1:E1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
$objPHPExcel->getActiveSheet()->getStyle('A1:E1')->getFill()->getStartColor()->setARGB('FF808080');



$objPHPExcel->getActiveSheet()->getStyle('A3')->applyFromArray(
		array(
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
			),
			'borders' => array(
				'left'     => array(
 					'style' => PHPExcel_Style_Border::BORDER_THIN
 				)
			)
		)
);

$objPHPExcel->getActiveSheet()->getStyle('B3')->applyFromArray(
		array(
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
			)
		)
);

$objPHPExcel->getActiveSheet()->getStyle('E3')->applyFromArray(
		array(
			'borders' => array(
				'right'     => array(
 					'style' => PHPExcel_Style_Border::BORDER_THIN
 				)
			)
		)
);

*/

/*
// Play around with inserting and removing rows and columns
echo date('H:i:s') , " Play around with inserting and removing rows and columns" , EOL;
$objPHPExcel->getActiveSheet()->insertNewRowBefore(6, 10);
$objPHPExcel->getActiveSheet()->removeRow(6, 10);
$objPHPExcel->getActiveSheet()->insertNewColumnBefore('E', 5);
$objPHPExcel->getActiveSheet()->removeColumn('E', 5);

// Set header and footer. When no different headers for odd/even are used, odd header is assumed.
echo date('H:i:s') , " Set header/footer" , EOL;
$objPHPExcel->getActiveSheet()->getHeaderFooter()->setOddHeader('&L&BInvoice&RPrinted on &D');
$objPHPExcel->getActiveSheet()->getHeaderFooter()->setOddFooter('&L&B' . $objPHPExcel->getProperties()->getTitle() . '&RPage &P of &N');

// Set page orientation and size
echo date('H:i:s') , " Set page orientation and size" , EOL;
$objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_PORTRAIT);
$objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
*/


// Rename first worksheet
//echo date('H:i:s') , " Rename first worksheet" , EOL;
$objPHPExcel->getActiveSheet()->setTitle('Report');


// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);








// Save Excel 2007 file
//*echo date('H:i:s') , " Write to Excel2007 format" , EOL;
$callStartTime = microtime(true);

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save($file_name_export);
//echo $file_name_export."\n";
$callEndTime = microtime(true);
$callTime = $callEndTime - $callStartTime;

//echo date('H:i:s') , " File written to " , str_replace('.php', '.xlsx', pathinfo(sys_get_temp_dir (), PATHINFO_BASENAME)) , EOL;
//echo 'Call time to write Workbook was ' , sprintf('%.4f',$callTime) , " seconds" , EOL;
// Echo memory usage
//echo date('H:i:s') , ' Current memory usage: ' , (memory_get_usage(true) / 1024 / 1024) , " MB" , EOL;

//    header('Content-Length: ' . filesize($file_name_export));

ob_clean();
            flush();
$fp = fopen($file_name_export, 'rb');
  fpassthru($fp);
}

public function result_as_html_table($result, $header = true, $title = ""){

$id = md5("woams_contact_widget".microtime());
$r = "<html>

	<head> 
    <meta charset=\"utf-8\"/>
        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"/>";

$r = $r."<script type=\"text/javascript\">
	window.onload=function(){
	var tfrow = document.getElementById('".$id."').rows.length;
	var tbRow=[];
	for (var i=1;i<tfrow;i++) {
		tbRow[i]=document.getElementById('".$id."').rows[i];
		tbRow[i].onmouseover = function(){
		  this.style.backgroundColor = '#ffffff';
		};
		tbRow[i].onmouseout = function() {
		  this.style.backgroundColor = '#d4e3e5';
		};
	}
};
</script>

<style type=\"text/css\">
table.tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color: #729ea5;border-collapse: collapse;}
table.tftable th {font-size:12px;background-color:#acc8cc;border-width: 1px;padding: 8px;border-style: solid;border-color: #729ea5;text-align:left;}
table.tftable tr {background-color:#d4e3e5;}
table.tftable td {font-size:12px;border-width: 1px;padding: 8px;border-style: solid;border-color: #729ea5;}
</style>

</head>

<body>

<div>";


    $arr = array();

    if (!$result) {
        echo pg_last_error($result);
        echo pg_result_error($result);
    } else {

if(strlen($title) > 0){
$r = $r."<h3>".$title."</h3>";
}

$r = $r."\n\r<table id=\"".$id."\" class=\"tftable\" border=\"1\">\n\r";

    $arr = pg_fetch_all($result);

//print_r($arr);
if(is_array($arr)){
    $this->result_array_normalize($arr);
}else{
    $arr = array();
}

    }

    $h = array();

if($header){
$r = $r.pguDCGrid::row_as_th_html($arr[0]);
}


    foreach ($arr as $row) {
$r = $r.pguDCGrid::row_as_td_html($row);
    }


$r = $r."</table> 
</div> 
</body> 
</html>";
    return $r;
}

private  function row_as_th_html($row){
//print_r($row);

$r = "\n\r<tr>";
foreach($row as $k => $v){

if (array_key_exists($k, $this->Columns)) {
$r = $r."	<th>".strtoupper($this->Columns[$k]["column_label"])."</th>\n";
}else{
$r = $r."	<th>[".strtoupper($k)."]</th>\n";
}



}
$r = $r."</tr>\n\r";
return $r;
}

private  function row_as_td_html($row){
$r = "\n\r<tr>";
foreach($row as $value){
$r = $r."	<td>".$value."</td>\n";
}
$r = $r."</tr>\n\r";
return $r;
}

//build_query_select($return_fields = array(), $where = array(), $orderby="", $limit = 0, $and_field_any = "", $and_values_any = array()) 
public function export_as_html($header = true, $title = "", $return_fields = array(), $where = array(), $orderby="", $limit = 0, $and_field_any = "", $and_values_any = array()){
$d = $this->build_query_select($return_fields, $where, $orderby, $limit, $and_field_any, $and_values_any);
return $this->result_as_html_table($this->query_params($d["query"], $d["datas"]), $header, $title);
}






//public function export_as_xlsx($result, $header = true, $title = ""){


}



/*
class SQLite3uDC extends SQLite3
{
    function __construct()
    {
       $this->open('sqlite/udc.sqlite3');
    }
public function _build_(){
$this->exec('CREATE TABLE structure(dbname STRING, table_name STRING, column_name STRING, data_type STRING, column_default STRING, column_label STRING, column_width STRING, editor STRING)');

}

public function column_label($dbname, $table, $column){
$label = "";

$stmt = $this->prepare('SELECT column_label FROM structure WHERE dbname=:dbname AND table_name=:table AND column_name=:column LIMIT 1;');
$stmt->bindValue(':dbname', $dbname, SQLITE3_STRING);
$stmt->bindValue(':table', $table, SQLITE3_STRING);
$stmt->bindValue(':column', $column, SQLITE3_STRING);

$result = $stmt->execute();

while ($row = $results->fetchArray()) {
    var_dump($row);
}

return $label;
}


}
*/


/*
class Misc extends pguDC {

private static function append_attrs($default_attrs, $attrs){
$r = "";
$attrsfs = array_merge($default_attrs, $attrs);
foreach($attrsfs as $k=>$v){
$r = $r." ".$k."=\"".$v."\"";
}
return $r;
}

// $query
public function FilteringSelect($attrs = array(), $query, $label="", $input_name=""){

$r = Fields::create_label($label, $input_name);
$default_attrs = array("value"=>"0", "intermediateChanges"=>"false", "trim"=>"false", "uppercase"=>"false", "lowercase"=>"false", "propercase"=>"false", "pageSize"=>"Infinity", "searchDelay"=>"200");

  $r =  $r."<select data-dojo-type=\"dijit/form/FilteringSelect\" ".Fields::append_attrs($default_attrs, $attrs);

$r = $r."\>";

$result = pg_query($this->connection, $query);

while ($row = pg_fetch_array($result)) 
{ 
     $r = $r."<option value=\"".$row["id"]."\">".$row["name"]."</option>\n"; 
}

    $r = $r."</select>";

return $r;
}

private static function create_label($label="", $input_name=""){
$r = "";
if(strlen($label) > 0){
if(strlen($input_name) > 0){
$r = "<label for=\"".$input_name."\">".$label."</label> ";
}else{
$r = "<label>".$label."</label> ";
}
}
return $r;
} 

public function ValidationTextBox($attrs = array(), $label="", $input_name=""){

$r = Fields::create_label($label, $input_name);
$default_attrs = array("data-dojo-props"=>"invalidMessage:'Invalid Non-Space Text.', missingMessage: 'Este campo es necesario'", "type"=>"text");

$r =  $r."<input data-dojo-type=\"dijit/form/ValidationTextBox\" ".Fields::append_attrs($default_attrs, $attrs);

$r = $r."\></input>";

return $r;
}

public function TextBox($attrs = array(), $label="", $input_name=""){

$r = Fields::create_label($label, $input_name);
$default_attrs = array("data-dojo-props"=>"invalidMessage:'Invalid Non-Space Text.', missingMessage: 'Este campo es necesario'", "type"=>"text");

$r =  $r."<input data-dojo-type=\"dijit/form/TextBox\" ".Fields::append_attrs($default_attrs, $attrs);

$r = $r."\></input>";

return $r;
}

public function CheckBox($attrs = array(), $label="", $input_name=""){

$r = Fields::create_label($label, $input_name);
$default_attrs = array("type"=>"checkbox");

$r =  $r."<input data-dojo-type=\"dijit/form/CheckBox\" ".Fields::append_attrs($default_attrs, $attrs);

$r = $r."\></input>";

return $r;
}

public function DateTextBox($attrs = array(), $label="", $input_name=""){

$r = Fields::create_label($label, $input_name);
$default_attrs = array("type"=>"text");

$r =  $r."<input data-dojo-type=\"dijit/form/DateTextBox\" ".Fields::append_attrs($default_attrs, $attrs);

$r = $r."\></input>";

return $r;
}





}
*/




/**
 * Simple example of extending the SQLite3 class and changing the __construct
 * parameters, then using the open method to initialize the DB.
 */

/*
class SQLite3uDC extends SQLite3
{
    function __construct()
    {
        $this->open('udc.sqlite3');
    }
public _build_(){
$this->exec('CREATE TABLE pg_structure(dbname STRING, table_name STRING, column_name STRING, data_type STRING, column_default STRING, column_label STRING, column_width STRING, editor STRING)');

}

}


$db = new SQLite3uDC();
$db->exec('CREATE TABLE foo (bar STRING)');
$db->exec("INSERT INTO foo (bar) VALUES ('This is a test')");
$result = $db->query('SELECT bar FROM foo');
var_dump($result->fetchArray());
*/
?>
