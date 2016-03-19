<?php

ini_set('display_errors', -1);
//include_once("_DBMAP_open_ams.php");
$oams_config = parse_ini_file("oams.ini.php");

class pguDC {

    // Declaración de la propiedad
//    private $conn_string = "host=localhost port=5432 dbname=open_ams user=postgres password=pg1234";
public $host="localhost";
public $port=5432;
public $dbname="oams";
public $user="postgres";
public $password="pg1234";
public $catalog="postgres";
    public $connection = null;
	public $idadmin = -100;
private $datatypes = array();

public $table_name = "";

public function login() {

    $Retorno = false;
// Devuelve true si no se ha solicitado loguearse
    if (isset($_POST['oams_submit'])) {

        /* Check and assign submitted Username and Password to new variable */
        $user = isset($_POST['oams_user']) ? $_POST['oams_user'] : 'anonymous';
        $pwd = isset($_POST['oams_pwd']) ? $_POST['oams_pwd'] : '';

        $result = pg_query_params($this->connection, "SELECT login, username, sessionid, fullname, msg FROM fun_login($1::text, $2::text, $3::text, $4::text);", array($user, $pwd, $_SERVER['HTTP_USER_AGENT'], $_SERVER['REMOTE_ADDR']));
        $row = pg_fetch_assoc($result);
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
        $result = pg_query_params($this->connection, "SELECT idcontact as idadmin FROM contacts WHERE is_admin = true AND admin_username = $1::text AND admin_sessionid= $2::TEXT AND admin_ip = $3::TEXT;", array($_COOKIE['oams_username'], $_COOKIE['oams_sessionid'], $_SERVER['REMOTE_ADDR']));
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
    oamsDB::result_array_normalize($table_name, $arr);
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



static function result_array_normalize($table_name, &$array_result){

foreach ($array_result as &$row) {

foreach ($row as $k => &$v) {

if(isset($GLOBALS["dbmap_open_ams"][$table_name][$k])){
// En esta parte convertimos los valores boleanos devueltos por postgres a boleanos validos para json
switch($GLOBALS["dbmap_open_ams"][$table_name][$k]["data_type"]){
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
    oamsDB::result_array_normalize($table_name, $arr);
}else{
    $arr = array();
}
	


    }

//print_r($arr);

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
}else{
echo "no ha ingresado un catalogo";
}

        $this->connection = pg_connect("host=".$this->host." port=".$this->port." dbname=".$this->dbname." user=".$this->user." password=".$this->password) or die("Could not connect with DB - host=".$this->host." port=".$this->port." dbname=".$this->dbname." user=".$this->user);

// Si el usuario ingresa 
if(strlen($table) > 0){
$this->table_name = $table;
}

// Si hay ingresada un tabla se usará para mapearla
if(strlen($this->table_name) > 0){
$sc = pg_query_params($this->connection, "SELECT column_name, data_type FROM information_schema.columns WHERE table_catalog = $1::TEXT  AND table_schema = 'public' AND table_name = $2::TEXT;", array($this->catalog, $this->table_name));

while($row = pg_fetch_array($sc)) {
$datatypes[$row["column_name"]] = $row["data_type"];
} 

}

	return $this->connection;
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
return "{\"insert\": \"".$r."\", \"error\": \"".pg_last_error($this->connection)."\", \"notice\": \"".pg_last_notice($this->connection)."\"}";
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

            if (array_key_exists($field, $this->datatypes)) {
$t = $this->datatypes[$field];
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
                    if (array_key_exists($k, $this->datatypes[$field]) && !in_array($k, $ignore_data)) {
                        $d[$k] = $v;
                    }
            }
return $d;
    }



// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente, $where un array con los nombres de los campos para hacer where
    public function update($data, $where, $ignore_data = array(), $require_where = true) {

$dt_data = $this->data_to_array($data, $ignore_data); 
$dt_where = $this->data_to_array($where);

$dt = $this->buid_data_and_type_array(array_merge($dt_data, $dt_where));

$set = array_slice($dt["datatypes"], 0, count($dt_data));

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
return "{\"update\": \"".$r."\", \"error\": \"".pg_last_error($this->connection)."\", \"notice\": \"".pg_last_notice($this->connection)."\"}";
    }

// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente, $where un array con los nombres de los campos para hacer where
    private function build_query_select($return_fields = array(), $where = array(), $orderby="", $limit = 0) {

        $fields = array();
        $w = array();
        $datas = array();
        $i = 1;

        foreach ($this->datatypes as $k => $v) {

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


public function select_where($return_fields = array(), $where = array(), $orderby="", $limit = 0){
$d = $this->build_query_select($return_fields, $where, $orderby, $limit);
return pg_query_params($this->connection, $d["query"], $d["datas"]);
}


    public function delete_result_as_json($where = array(), $require_where = true) {
$r = $this->delete($where, $require_where);
if($r < 1){
$r = -1;
}
return "{\"delete\": \"".$r."\", \"error\": \"".pg_last_error($this->connection)."\", \"notice\": \"".pg_last_notice($this->connection)."\"}";
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

}

?>
