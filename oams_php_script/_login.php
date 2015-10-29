<?php

ini_set('display_errors', 1);
/*
  function login($user, $pwd, $useragent, $ip, $sessionid, $cs){
  $Retorno = false;
  $pGdbconn = pg_connect($cs);
  $result = pg_query_params($pGdbconn, "SELECT fun_return, fun_msg FROM fun_login($1::text, $2::text, $3::text, $4::text, $5::text);", array($user, $pwd, $useragent, $ip, $sessionid));
  $row = pg_fetch_assoc($result);

  if($row["fun_return"] == 0){
  $Retorno = true;
  }

  return $Retorno;
  }
 */
?>
