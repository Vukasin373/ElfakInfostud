export default interface Message {
    id: number;
    chatName : string;
    content : string;
    time : Date;
    senderUsername : string;
    receiverUsername : string;
    seen : boolean;
}
