import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";
import { CommentChat } from "../domain/comment";
import Notification from "../domain/notification";
import agent from "../api/agent";

export default class NotificationStore 
{
    notifications : Notification[] = [];
    unreadNotificationsCount: number = 0;
    hubConnection : HubConnection |  null= null;
    
    constructor(){
        makeAutoObservable(this);
    }

    createHubConnection = (username: string) => {
        console.log("username"+ username);

        if(username) {
            console.log("signalR started"+ store.commonStore.token);
            this.hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5293/notifications?username='+username,{
                accessTokenFactory : () => store.commonStore.token!    
            //accessTokenFactory : () => store.accountStore.user?.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

            this.hubConnection.start().catch(error => console.log('Error establishing the connection: ',error));
        
           

            this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
                runInAction(()=>{
                    notification.time = new Date(notification.time);
                    let sameNotif = this.notifications.find(x=>x.id === notification.id);
                    if(sameNotif===undefined){
                    this.notifications.unshift(notification);
                    this.notifications.sort((a, b) => b.time.getTime() - a.time.getTime());
                    }
                    else
                        console.log("duplikat");
                    
                    if(store.accountStore.user?.viewedNotificationsCount! < this.notifications.length)
                    {
                        this.unreadNotificationsCount = this.notifications.length - store.accountStore.user?.viewedNotificationsCount!;
                    }
                    // console.log(this.unreadNotificationsCount);
                    // console.log(store.accountStore.user?.viewedNotificationsCount! );
                    // console.log(this.notifications.length );
                })
            })

           
        }

    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error=> console.log('Error stopping connection: ', error));
    }

    readAllNotifications = async (username: string ) => {
        try{

            await agent.Notifications.readAllNotifications(username, this.notifications.length);
            runInAction(()=>{
                this.unreadNotificationsCount = 0;
                store.accountStore.user!.viewedNotificationsCount =  this.notifications.length;
            })
        }
        catch(error ){
            console.log(error);
        }

    }
}