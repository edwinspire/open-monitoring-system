<?php

require_once ('smbclient/smbclient.php');

$smbc = new smbclient ('//192.168.238.159/d$', 'administrador', 'C0ntr@53n@');

print_r($smbc->dir());

/*
if (!$smbc->get ('path/to/desired/file.txt', '/tmp/localfile.txt'))
{
    print "Failed to retrieve file:\n";
    print join ("\n", $smbc->get_last_stdout());
}
else
{
    print "Transferred file successfully.";
}
*/

?>
