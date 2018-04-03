export default class WebSocketIO {
    private sio;
    constructor(httpsServer: any);
    private onDisconnect(client);
    private onReconnect(client);
    private onHeartbeat(client);
    private onService(client);
    private onLogin(client);
    io(): any;
}
