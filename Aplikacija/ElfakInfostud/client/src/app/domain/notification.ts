export default interface Notification {
    id: string,
    senderUsername: string,
    receiverUsername : string,
    comment : string,
    time: Date;
    postId:string;
}