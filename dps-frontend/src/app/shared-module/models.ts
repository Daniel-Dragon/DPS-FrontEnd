export interface Event {
    id: Number;
    name: String;
    startTime: Date;
    endTime: Date;
    description: String;
    volunteerGroups: VolunteerGroup[];
}

export interface VolunteerGroup {
    title: String;
    startTime: Date;
    endTime: Date;
    volunteers?: Volunteer[];
}

export interface Volunteer {
    name: String;
    email: String;
    startTime: Date;
    endTime: Date;
}