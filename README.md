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
 `fakeroot dpkg -b  /here/the/path/to/the/downloaded/open-monitoring-system/openmonitoringsystem

This should create a debian installer.

    openmonitoringsystem.deb

 Install it using dpkg, apt-get or your favorite installer.


----------
> **Note:**

> - You must have all package dependencies installed before you begin.
> - In case of problems with dependencies you can execute **apt-get install -f**
