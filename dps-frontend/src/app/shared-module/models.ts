export interface Event {
    ID: number;
    name: String;
    startTime: Date;
    endTime: Date;
    description: String;
    jobs: Job[];
}

export interface Job {
    ID: number;
    name: String;
    startTime: Date;
    endTime: Date;
    volunteer: Volunteer;
}

export interface Volunteer {
    ID: number;
    name: String;
    email?: String;
}

export interface User {
    ID: number;
    name: String;
    email: String;
    phoneNumber: String;
}

export interface Permissions {
    admin: Boolean;
    employee: Boolean;
    volunteer: Boolean;
    developer: Boolean;
}

export interface Conversation {
    ID: number;
    with: string;
    numNew: number;
    messages: Message[];
}

export interface Message {
    from: string;
    message: string;
    time: Date;
}
