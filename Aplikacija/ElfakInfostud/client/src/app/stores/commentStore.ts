import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";
import { CommentChat } from "../domain/comment";
import agent from "../api/agent";


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
            .withUrl('http://localhost:5293/chatComments?postId='+postId + '&username=' + store.accountStore.user?.username,{
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
                    console.log(comment.content);
                    comment.time = new Date(comment.time);
                    let samePost = this.comments.find(x=>x.id === comment.id);
                    if(samePost===undefined){

                        this.comments.unshift(comment);
                        this.comments.sort((a, b) => b.time.getTime() - a.time.getTime());
                    }
                    else
                        console.log("duplikat");
                })
            })

            this.hubConnection.on('DeleteComment',(id:string)=>{
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
        agent.Posts.disconnectConsumerForSpecificPost(store.accountStore.user?.username!, store.postStore.selectedPost?.id!);
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