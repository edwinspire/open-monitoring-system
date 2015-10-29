<?php

ini_set('display_errors', 1);
header("Location: ../images/farmacias");

if ($_FILES['fotos']) {
    $file_ary = reArrayFiles($_FILES['fotos']);

    foreach ($file_ary as $file) {
        //  print 'File Name: ' . $file['name'];
        //  print 'File Type: ' . $file['type'];
        //   print 'File Size: ' . $file['size'];
        //   print 'tmp_name: ' . $file['tmp_name'];

        if (exif_imagetype($file['tmp_name']) > 0) {

            $nombre_archivo = $_POST['oficina'] . "-" . $file['name'];
            $destino = "/var/www/html/images/farmacias/$nombre_archivo";
            echo $destino . "</br>";
            move_uploaded_file($file['tmp_name'], $destino);
            $salida = shell_exec('mogrify -quality 20 ' . $destino);
            echo "<pre>$salida</pre>";
        } else {
            echo "<pre>No es imagen</pre>";
        }
    }
}

function reArrayFiles(&$file_post) {

    $file_ary = array();
    $file_count = count($file_post['name']);
    $file_keys = array_keys($file_post);

    for ($i = 0; $i < $file_count; $i++) {
        foreach ($file_keys as $key) {
            $file_ary[$i][$key] = $file_post[$key][$i];
        }
    }

    return $file_ary;
}

?>
