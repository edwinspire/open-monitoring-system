MOUNTJS
===================


**MountJS** permite montar recursos de red usando varios protocolos, por ejemplo FTP, SSH, WebDav, SMB. Usa [GIO](https://developer.gnome.org/gio/stable/) en Linux para hacer su trabajo.
En entornos Windows funciona parcialmente.

> **Note:**
> MountJS can be used as a NodeJS module or independently from the command line.

----------


MountJS from command line
-------------
Parameters:

 1. Protocol (ftp, smb, ssh, etc).
 2. Domain
 3. Path
 4. Anonymous (true or false)
 5. Username (Required if Anonymous is false.)
 6. Password (Required if Anonymous is false.)
 7. Timeout (seconds, is optional)

**Samples**
Mount to a Samba network resource or Windows shared folder:

    ./mount "smb" "workgroup" "172.10.100.50/c$" "false" "myuser" "mypassword" "30"
 
Mount to an FTP site anonymously:

    ./mount "ftp" "" "ftp.gnu.org" "true" "anonymous" "" "120"
 

As a result, a JSON is obtained with the detail of the mounted resource or Error if it is the case:

       {
       "mount":{
          "can_eject":false,
          "can_unmount":true,
          "icon":". GThemedIcon folder-remote folder",
          "name":"ftp.gnu.org",      "root":"/run/user/1000/gvfs/ftp:host=ftp.gnu.org,user=anonymous",
          "sort_key":"(null)",
          "uuid":"(null)",
          "is_shadowed":false,   "default_location":"/run/user/1000/gvfs/ftp:host=ftp.gnu.org,user=anonymous"
       },
       "params":{
          "protocol":"ftp",
          "path":"ftp.gnu.org",
          "username":"anonymous",
          "password":"",
          "domain":"",
          "anonymous":true,
          "uri":"ftp://anonymous@ftp.gnu.org/",
          "timeout":120
       }
    }

-------------
As NodeJS Module
-------------
Install with npm with the following command:

    npm install mount-js

Using:

    var mjs = require('mount-js');
    var MountJS = new mjs();
    
    MountJS.on('mounted', function(m){
    console.log(m);
    });
    
    MountJS.on('fail', function(m){
    console.log(m);
    });
    
    MountJS.mount({domain: 'group', username: 'anonymous', password: '', location: 'ftp.gnu.org', protocol: 'ftp', timeout : 60});

Once it has been mounted you can use "root" or "default_location" as the address to access as a local directory.