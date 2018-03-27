export interface Event {
    id: number;
    name: String;
    startTime: Date;
    endTime: Date;
    description: String;
    jobs: Job[];
}

export interface Job {
    id: number;
    name: String;
    startTime: Date;
    endTime: Date;
    volunteer: Volunteer;
}

export interface Volunteer {
    id: number;
    name: String;
    email?: String;
}

export interface User {
    id: number;
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
    id: number;
    with: string;
    numNew: number;
    messages: Message[];
}

export interface Message {
    from: string;
    message: string;
    time: Date;
}
