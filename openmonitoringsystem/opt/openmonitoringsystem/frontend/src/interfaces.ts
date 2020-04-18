interface User {
    id: string;
    name: string;
}

export interface State {
    auth: {
        token: string;
    };
    users: {
        current: User;
        list: User[];
    };
}