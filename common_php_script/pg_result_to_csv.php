<?php

function pg_result_to_csv($result) {
    $arr = array();

    if (!$result) {
        echo pg_last_error($result);
        echo pg_result_error($result);
    } else {
        $arrx = pg_fetch_all($result);
        if (is_array($arrx)) {
            $arr = $arrx;
        }
    }

//print_r( $arr);
//$r = arrayToCsv($headers);

    $h = array();

    foreach ($arr[0] as $k => $v) {
        array_push($h, strtoupper($k));
    }

    $r = arrayToCsv($h);

    foreach ($arr as $row) {
        $r = $r . "\n\r" . arrayToCsv($row);
    }

    return $r;
}

function arrayToCsv(array &$fields, $delimiter = ';', $enclosure = '"', $encloseAll = false, $nullToMysqlNull = false) {
    $delimiter_esc = preg_quote($delimiter, '/');
    $enclosure_esc = preg_quote($enclosure, '/');

    $output = array();

    foreach ($fields as $k => $v) {

        if ($v === null && $nullToMysqlNull) {
            $output[] = 'NULL';
            continue;
        }

        // Enclose fields containing $delimiter, $enclosure or whitespace
        if ($encloseAll || preg_match("/(?:${delimiter_esc}|${enclosure_esc}|\s)/", strip_tags($v))) {
            $output[] = $enclosure . str_replace($enclosure, $enclosure . $enclosure, strip_tags($v)) . $enclosure;
        } else {
            $output[] = strip_tags($v);
        }
    }

    return implode($delimiter, $output);
}

?>
