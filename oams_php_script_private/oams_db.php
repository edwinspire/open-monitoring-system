<?php

ini_set('display_errors', -1);
include_once("_DBMAP_open_ams.php");

class oamsDB {

    // Declaración de la propiedad
    private $conn_string = "host=localhost port=5432 dbname=open_ams user=postgres password=pg1234";
    public $connection = null;
	public $idadmin = -100;
   // private $tables = array();
	
public function login() {
// session_start();
    $Retorno = true;

//print_r($_POST);
// Devuelve true si no se ha solicitado loguearse
    if (isset($_POST['oams_submit'])) {

        /* Check and assign submitted Username and Password to new variable */
        $user = isset($_POST['oams_user']) ? $_POST['oams_user'] : 'anonymous';
        $pwd = isset($_POST['oams_pwd']) ? $_POST['oams_pwd'] : '';

        $result = pg_query_params($this->connection, "SELECT login, username, sessionid, fullname, msg FROM fun_login($1::text, $2::text, $3::text, $4::text);", array($user, $pwd, $_SERVER['HTTP_USER_AGENT'], $_SERVER['REMOTE_ADDR']));
        $row = pg_fetch_assoc($result);

      // echo $row["login"]."</br>";
//echo $row["msg"]."</br>";
//print_r($row);
        if ($row["login"] == "t") {
            $Retorno = true;
	//$this->idadmin = $row["idadmin"];
	//$_SESSION['oams_userid'] =  $row["fun_return"];
          //  $_SESSION['oams_username'] = $row["fun_msg"];
		setcookie("oams_fullname", $row["fullname"], (time()+3600)*8);  /* expira en 8 hora */
		setcookie("oams_username", $row["username"], (time()+3600)*8);  /* expira en 8 hora */
		setcookie("oams_sessionid", $row["sessionid"], (time()+3600)*8);  /* expira en 8 hora */
        }
    }


//session_write_close(); 
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
// TODO Hacer nmas  simp,e el query del logout
//    $pGdbconn = pg_connect($cs);
// Elimina el session_id del servidor
// print_r($_COOKIE);

    if (isset($_COOKIE['oams_username'])) {
        $result = pg_query_params($this->connection, "SELECT fun_logout($1::bigint, $2::text) as result;", array($_COOKIE['oams_username'], $_COOKIE['oams_sessionid'])); //$_SERVER['HTTP_USER_AGENT'], $_SERVER['REMOTE_ADDR'], session_id()   

    }

	setcookie("oams_fullname", "anonymous", time()+1);
	setcookie("oams_username", "anonymous", time()+1);
	setcookie("oams_sessionid", "anonymous", time()+1);

//    $_SESSION = array();

// Si se desea destruir la sesión completamente, borre también la cookie de sesión.
// Nota: ¡Esto destruirá la sesión, y no la información de la sesión!
/* 
   if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]
        );
    }
*/

// Finalmente, destruir la sesión.
//    session_destroy();
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
        array_push($h, strtoupper($k));
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
switch($GLOBALS["dbmap_open_ams"][$table_name][$k]){
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



    public function mapper_table($table_name = "") {

       // global $_DBMAP_open_ams;
      // print_r($GLOBALS["dbmap_open_ams"]);

        if (strlen($table_name) > 0) {
            $t = array();
            $result = pg_query_params($this->connection, "SELECT column_name, data_type FROM information_schema.columns WHERE table_catalog = 'open_ams'  AND table_schema = 'public' AND table_name = $1::TEXT;", array($table_name));

            $columns = array();
            while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $columns[$row["column_name"]] = $row["data_type"];
            }

            $GLOBALS["dbmap_open_ams"][$table_name] = $columns;
        } 

//print_r($GLOBALS["dbmap_open_ams"]);
    }

    // Declaración del método
    public function connect() {
        $this->connection = pg_connect($this->conn_string) or die("Could not connect");
	return $this->connection;
    }

// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente
    public function insert($table_name, $data, $ignore_data = array()) {

	if(!isset($GLOBALS["dbmap_open_ams"][$table_name])){
$this->mapper_table($table_name);
}

        $d = array();

        foreach ($data as $k => $v) {
                    if (array_key_exists($k, $GLOBALS["dbmap_open_ams"][$table_name]) && !in_array($k, $ignore_data)) {
                        $d[$k] = $v;
                    }
            }

return (bool) pg_insert($this->connection, $table_name, $d);
    }



// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente, $where un array con los nombres de los campos para hacer where
    public function update($table_name, $data, $iwhere, $ignore_data = array(), $require_where = true) {

        // $this->admin_signed();

        $set = array();
        $d = array();
        $where = array();
        $ret = array();
        $i = 1;

	if(!isset($GLOBALS["dbmap_open_ams"][$table_name])){
$this->mapper_table($table_name);
}


        foreach ($data as $k => $v) {

                    if (array_key_exists($k, $GLOBALS["dbmap_open_ams"][$table_name]) && !in_array($k, $ignore_data)) {
                        $d[$k] = $v;
                    }
            }
        
$r = false;

if($require_where){

if(count($iwhere) > 0){
$r = pg_update($this->connection, $table_name, $d, $iwhere);
}

}else{
$r = pg_update($this->connection, $table_name, $d, $iwhere);
}

return (bool)$r;
    }

// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente, $where un array con los nombres de los campos para hacer where
    public function select($table_name, $return_fields = array(), $where = array(), $orderby="", $limit = 0) {

        $fields = array();
        $w = array();
        $datas = array();
        $i = 1;

	if(!isset($GLOBALS["dbmap_open_ams"][$table_name])){
$this->mapper_table($table_name);
}

        foreach ($GLOBALS["dbmap_open_ams"][$table_name] as $k => $v) {

     if (in_array($k, $return_fields)) {
                array_push($fields, $k);
            }   
    
            if (array_key_exists($k, $where)) {
                array_push($w, $k . "=$" . $i . "::" . $GLOBALS["dbmap_open_ams"][$table_name][$k]);
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

        $query = $query . " FROM " . $table_name;

        if (count($w) > 0) {
            $query = $query . " WHERE " . implode(', ', $w);
        }


if(strlen($orderby) > 0){
 $query = $query . " ORDER BY " . $orderby;
}

        if ($limit > 0) {
            $query = $query . " LIMIT " . $limit;
        }

        $query = $query . ";";
//echo $query;
        return pg_query_params($this->connection, $query, $datas);
    }

// Debe ser un array que contenga como llave el nombre de la columna y como valor el valor correspondiente, $where un array con los nombres de los campos para hacer where
    public function delete($table_name, $where = array(), $require_where = true) {

$r = false;

if($require_where){

if(count($where) > 0){
$r = pg_delete($this->connection, $table_name, $where);
}

}else{
$r = pg_delete($this->connection, $table_name, $where);
}

return $r;
    }

public  function select_result_as_json($table_name, $return_fields = array(), $where = array(), $orderby="", $limit = 0){
return oamsDB::result_to_json($table_name, $this->select($table_name, $return_fields, $where, $orderby, $limit));
}

public  function select_result_as_csv($table_name, $return_fields = array(), $where = array(), $orderby="", $limit = 0){
return oamsDB::result_to_csv($table_name, $this->select($table_name, $return_fields, $where, $orderby, $limit));
}

}

//$ff = new oamsDB();
//$ff->mapper_table();
?>
