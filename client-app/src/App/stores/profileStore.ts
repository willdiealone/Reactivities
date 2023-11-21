import {makeAutoObservable, reaction, runInAction} from "mobx";
import {Photo, Profile, UserActivity} from "../models/profile";
import agent from "../api/agent";
import {store} from "./Store";

export default class ProfileStore{
    profile: Profile | null = null;
    loadingProfile = false;
    upLoading = false;
    loading = false;
    dispLoading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;
    loadingActivities = false;
    userActivities: UserActivity[] = [];
    
    constructor() {
        makeAutoObservable(this);
        reaction(() => this.activeTab, 
            activeTab => {
                if(activeTab === 3 || activeTab === 4){
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate)
                }else{
                    this.followings = []; 
                }
            })
    }
    
    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }
    
    get isCurrentUser() {
        if(store.userStore.user && this.profile){
            return store.userStore.user.userName === this.profile.userName 
        }
            return false;
    }
    
    loadProfile = async (username:string) =>{
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(()=>{
                this.profile = profile;
                this.loadingProfile = false;
            });
        }catch (e) {
            console.log(e)
            runInAction(()=> this.loadingProfile = false);
        }
    }
    
    ulpoadPhoto = async (file: Blob) => {
        this.upLoading = true;
        try{
            const response = await agent.Profiles.uploadPhoto(file);
            const photo : Photo = response.data;
            runInAction(()=> {
                if(this.profile){
                    this.profile.photos?.push(photo);
                    if(photo.isMain && store.userStore.user){
                     store.userStore.setImage(photo.url);
                     this.profile.image = photo.url;
                    }
                }
                this.upLoading = false
            })
        }catch (e) {
            console.log(e)
            runInAction(() => this.upLoading = false)
        }
    }
    
    setMainPhoto = async (photo: Photo) =>{
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(()=> {
                if(this.profile && this.profile.photos){
                    this.profile.photos.find(p=>p.isMain)!.isMain = false;
                    this.profile.photos.find(p=>p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })
        }catch (e) {
            console.log(e)
            runInAction(()=> this.loading = false)
        }
    }
    
    deletePhoto = async (photo: Photo)=> {
        this.loading = true;
        try{
            await agent.Profiles.deletePhoto(photo.id)
            runInAction(() => {
                if(this.profile){
                    this.profile.photos = this.profile.photos?.filter(p=>p.id !== photo.id);
                    this.loading = false
                }
            })
        }catch (e) {
            console.log(e)
            runInAction(()=> this.loading = false)
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        this.dispLoading = true;
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                if (profile.displayName && profile.displayName !==
                    store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }
                this.profile = { ...this.profile, ...profile as Profile };
                this.dispLoading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.dispLoading = false);
        }
    }
    
    updateFollowing = async (username: string, following: boolean) => {
        
        this.loading = true;
        
        try {
            
            agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            
            runInAction(() => {
                if(this.profile && this.profile.userName !== store.userStore.user?.userName &&
                    this.profile.userName === username){
                    
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                
                if(this.profile && this.profile.userName === store.userStore.user?.userName){
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                
                this.followings.forEach(profile => {
                    
                    if(profile.userName === username){
                        
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
                this.loading = false;
            })
        }catch (e) {
            console.log(e);
            runInAction(() => this.loading = false);
        }
    }
    
    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFolowings(this.profile!.userName,predicate);
            runInAction(()=> {
                this.followings = followings;
                this.loadingFollowings  = false;
            })
        }catch (e) {
            console.log(e)
            runInAction(() => this.loadingFollowings  = false);
        }
    }
    
    // setLoadingActivities = (loadingActivities :boolean) => {
    //     this.loadingActivities = loadingActivities;
    // }
    
    // 
    loadUserActivities = async (username: string, predicate?:string) => {
        this.loadingActivities = true;
        try {
            const activities = await  agent.Profiles.listActivities(username,predicate!);
            runInAction(() => {
                this.userActivities = activities;
                this.loadingActivities = false;
            })
        }catch (e) {
            console.log(e);
            runInAction(() => this.loadingActivities = false);
        }
    }
}