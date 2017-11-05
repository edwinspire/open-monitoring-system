Open Monitoring System!
===================

**Open Monitoring System** is application of general purpose to receive and manage incidents or system events in general. Your interace web in real time makes it easy to use. Developed in Javascript and supported by the power of PostgreSQL, Dojo Toolkit and NodeJS. 

----------

Requirements
-------------

 1. PostgreSQL v10 
 2. NodeJS (You can obtain a version for debian from: https://github.com/edwinspire/nodejs-debian) 
 3. Browser  

Create Debian Package
-------------

 Download the zip file (and unzip) or clone this repository.
Open a terminal as root and run:

    fakeroot dpkg -b  /here/the/path/to/the/downloaded/open-monitoring-system/openmonitoringsystem

This should create a debian installer.

    openmonitoringsystem.deb

 Install it using dpkg, apt-get or your favorite installer.


----------


**Installing PostgreSQL**
-------------
Open a terminal as root and run:
 `apt-get install postgresql postgresql-contrib postgresql-10-plv8`

> At the time of writing this tutorial there was still no PLV8 available for Debian Buster, so installers are included here.

Once installed we can see the status of the process with the following command:

 `systemctl status postgresql`

We will obtain an output like the following:

    ● postgresql.service - PostgreSQL RDBMS
       Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
       Active: active (exited) since Sat 2017-11-04 04:47:36 -05; 18h ago
      Process: 5449 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
     Main PID: 5449 (code=exited, status=0/SUCCESS)
        Tasks: 0 (limit: 4915)
       CGroup: /system.slice/postgresql.service
    
    nov 04 04:47:36 edelacruz-lp systemd[1]: Starting PostgreSQL RDBMS...
    nov 04 04:47:36 edelacruz-lp systemd[1]: Started PostgreSQL RDBMS.


**Basic configuration**
Change the password for your postgres account (UNIX) as root:

    passwd postgres

Output:

    Enter new UNIX password: 
    Retype new UNIX password: 
    passwd: password updated successfully

The administrator user in the factory database is **postgres**.
As root, execute the following command:

    su postgres
    psql

You will get an exit like this:

    psql (10.0)
    Digite «help» para obtener ayuda.
    
    postgres=# 

It is necessary to assign a key, we do it with the following command inside psql:

    \password postgres

**Configuring postgres for remote access:**

**postgres.conf**
> In Debian Buster it is located at the following path:
> `/etc/postgres/10/main/postgres.conf`
> 
> Search the line
**#listen_address = 'localhost'**
and change it
**listen_address = '*'**

**pg_hba.conf**
> In Debian Buster it is located at the following path:
> `/etc/postgres/10/main/pg_hba.conf`
> 
> Search the line
**host    all             all             127.0.0.1/32            md5**
and change it
**host    all             all             0.0.0.0/0            md5**

Now restart the server with the following command:

    systemctl restart postgresql

You can try to connect from another machine that is on the same network and should have access to the database.



----------
> **Notes:**
> - You must have all package dependencies installed before you begin.
> - In case of problems with dependencies you can execute **apt-get install -f**
> If you need **pgAdmin4** in this [link](https://github.com/edwinspire/pgadmin4-deb-package) you can find an installer for Debian.

