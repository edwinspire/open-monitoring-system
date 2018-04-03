/// <reference types="node" />
import { EventEmitter } from "events";
export interface EventData {
    iddata: string;
    idaccount: number;
    _foot_print_: number;
    dateevent: Date;
    idstatustype: number;
    priority: number;
    ideventtype: number;
    source: string;
    iddevice: number;
    idreceptionmode: number;
    description: string;
    details: object;
    ip: string;
    idadmin_assigned: number;
    creator: number;
    isopen: boolean;
}
export default class PostgreSQL extends EventEmitter {
    private poolPG;
    private APPConfig;
    private EventsMd5;
    constructor();
    query(q: string, p: Array<any>): Promise<{}>;
    private connect_notify(channels);
    private get_config_from_db();
    eventdata_insert(data: EventData): void;
}
