import {makeAutoObservable, runInAction} from "mobx";
import {Photo, Profile} from "../models/profile";
import agent from "../api/agent";
import {store} from "./Store";

export default class ProfileStore{
    profile: Profile | null = null;
    loadingProfile = false;
    upLoading = false;
    loading = false;
    
    constructor() {
        makeAutoObservable(this)
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
}