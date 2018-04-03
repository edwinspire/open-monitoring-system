export interface MountFSParam {
    protocol: string;
    domain: string;
    location: string;
    anonymous: boolean;
    username: string;
    password: string;
    timeout: number;
}
export interface Mounted {
    mount: {
        can_eject: boolean;
        can_unmount: boolean;
        icon: string;
        name: string;
        root: string;
        sort_key: string;
        uuid: string;
        location: string;
        is_shadowed: boolean;
        default_location: string;
    };
    params: MountFSParam;
}
export interface MountError {
    error: {
        code: number;
        message: string;
    };
    params: MountFSParam;
}
export default class MountFS {
    private param;
    private _mounted;
    constructor(param?: MountFSParam);
    readonly mounted: Mounted;
    mount(_param?: MountFSParam): Promise<{}>;
}
