import Message from "../../app/domain/message";
import { Profile } from "../../app/domain/profile";

export default interface ChatPartner {
    profile : Profile;
    lastMessage : Message;
}