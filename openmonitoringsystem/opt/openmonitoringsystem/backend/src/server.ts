import OpenMonitoringSystem from './class/server';
import {partial} from  '@dojo/core/lang';

process.env.PGDATABASE = 'oms';
process.env.PGUSER = 'postgres';
process.env.PGHOST = 'localhost';
process.env.PGPASSWORD = 'pg4321';
process.env.PGAPPNAME = 'OMSServer';
process.env.EXPRESS_PORT = '49443';

const OMS = new OpenMonitoringSystem();

OMS.run();