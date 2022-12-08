import { User } from "./User";

export interface Calendar {
    id: number;
    label: string; 
    day: string;
    meal: string;
    userInfo: number;
    userInfoNavigation: User;
}