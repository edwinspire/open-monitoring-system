<?php

$server = "192.168.0.201";
$database = "test";
$user = "";
$password = "123@abc";
// Microsoft SQL Server usando SQL Native Client 10.0 ODBC Driver - permite la conexión a SQL 7, 2000, 2005 y 2008
$conexión = odbc_connect("Driver={SQL Server Native Client 10.0};Server=$server;Database=$database;", $user, $password);


/*
  // Microsoft Access
  $conexión = odbc_connect("Driver={Microsoft Access Driver (*.mdb)};Dbq=$mdbFilename", $user, $password);

  // Microsoft Excel
  $excelFile = realpath('C:/ExcelData.xls');
  $excelDir = dirname($excelFile);
  $conexión = odbc_connect("Driver={Microsoft Excel Driver (*.xls)};DriverId=790;Dbq=$excelFile;DefaultDir=$excelDir" , '', ''); */
?>
