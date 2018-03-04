export interface Event {
    id: Number;
    name: String;
    startTime: Date;
    endTime: Date;
    description: String;
    jobs: Job[];
}

export interface Job {
    id: Number;
    name: String;
    startTime: Date;
    endTime: Date;
    volunteer: Volunteer;
}

export interface Volunteer {
    id: Number;
    name: String;
    email?: String;
}

export interface User {
    id: Number;
    name: String;
    email: String;
    phoneNumber: String;
}