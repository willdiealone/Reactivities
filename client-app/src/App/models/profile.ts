import {User} from "../../features/users/User";

export interface Profile {
    userName: string
    displayName: string
    bio: string
    image?: string
}

export class Profile implements Profile{
    constructor(user: User) {
        this.userName = user.userName
        this.displayName = user.displayName
        this.image = user.image 
        
    }
}