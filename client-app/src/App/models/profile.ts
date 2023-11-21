import {User} from "../../features/users/User";

export interface UserActivity{
    id: string
    title: string
    category: string
    date: Date
}

export interface Profile {
    userName: string
    displayName: string
    bio: string 
    image?: string
    followersCount: number
    followingCount: number 
    following: boolean
    photos?: Photo[]
    userActivity: UserActivity[]
}

export interface Photo{
    id: string
    url: string
    isMain: boolean
}

export class Profile implements Profile{
    constructor(user: User) {
        this.userName = user.userName
        this.displayName = user.displayName
        this.image = user.image
    }
}
