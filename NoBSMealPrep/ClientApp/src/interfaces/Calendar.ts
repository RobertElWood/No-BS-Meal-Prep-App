import { User } from "./User";

export interface Calendar {
    id: number;
    label: any; 
    day: string;
    meal: string;
    userInfo: number;
    userInfoNavigation: User;
}