import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";
import { CommentChat } from "../domain/comment";


export default class CommentStore 
{
    comments : CommentChat[] = [];
    hubConnection : HubConnection |  null= null;
    
    constructor(){
        makeAutoObservable(this);
    }

    createHubConnection = (postId: string) => {
        if(store.postStore.selectedPost) {
            this.hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5293/chatComments?postId='+postId,{
                accessTokenFactory : () => store.accountStore.user?.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

            this.hubConnection.start().catch(error => console.log('Error establishing the connection: ',error));
        
            this.hubConnection.on('LoadComments', (comments : CommentChat[])=>{
                runInAction(()=>{
                    comments.forEach(comment =>{
                        comment.time = new Date(comment.time);
                    })
                    this.comments = comments;
                })
            })

            this.hubConnection.on('ReceiveComment', (comment:CommentChat) => {
                runInAction(()=>{
                    comment.time = new Date(comment.time);
                    this.comments.unshift(comment);
                })
            })

            this.hubConnection.on('DeleteComment',(id:number)=>{
                runInAction(()=>{
                    this.comments = this.comments.filter(x=>x.id!== id);
                })
            } )
        }

    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error=> console.log('Error stopping connection: ', error));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values:any)=> {
        console.log("opce");
        values.postId = store.postStore.selectedPost?.id;
        try {
            console.log(values);
            await this.hubConnection?.invoke('SendComment',values);

        }
        catch(error) {
            console.log(error);
        }
    }

    deleteComment = async (id: any) => {
        try{
            await this.hubConnection?.invoke('DeleteComment',id);
        }
    catch(error){
        console.log(error);
    }
    
    }
}