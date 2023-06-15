import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { store } from "./store";
import Message from "../domain/message";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { ru } from "date-fns/locale";
import ChatPartner from "../../features/chat/chatPartner";

export default class MessageStore {
  chatName: string | null = null;
  messages: Message[] = [];
  hubConnection: HubConnection | null = null;
  chatPartners: ChatPartner[] = [];
  numberOfUnseenMessages: number = 0;
  isConnectionEstablished: boolean = false;
  chatPartnerUsername: string | null = null;
  loadSeenFlag: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }

  getChatName = async (username: string) => {
    try {
      var name = await agent.Messages.getChatName(
        store.accountStore.user?.username!,
        username
      );
      runInAction(() => {
        this.chatName = name;
      });
    } catch (error) {
      console.log(error);
    }
  };

  createHubConnection = (chatName: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5293/chatMessages?chatName=" + chatName, {
        accessTokenFactory: () => store.accountStore.user?.token!,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => {})
      .catch((error) =>
        console.log("Error establishing the connection: ", error)
      );

    this.hubConnection.on("LoadMessages", (messages: Message[]) => {
      runInAction(() => {
        messages.forEach((message) => {
          message.time = new Date(message.time);
        });
        this.messages = messages;
        console.log(this.messages);
        this.readAllMessages();
      });
    });

    this.hubConnection.on("ReceiveMessage", (message: Message) => {
      runInAction(() => {
        message.time = new Date(message.time);
        if (message.senderUsername !== store.accountStore.user?.username) {
          message.seen = true;
          this.readMessage(message.id);
        }
        this.messages.push(message);
      });
    });

    this.hubConnection.on("SetToSeen", (id: number) => {
      runInAction(() => {
        var message = this.messages.find((x) => x.id === id);
        this.messages[this.messages.length - 1].seen = true;
      });
    });

    this.hubConnection.on("SetToSeenAllMessages", (obj: any) => {
      runInAction(() => {
        if (obj.lastMessage) {
          this.numberOfUnseenMessages -= obj.num;
          var mess = this.messages[this.messages.length - 1];
          mess.seen = obj.lastMessage.seen;
        }
      });
    });

    this.hubConnection.on("DeleteMessage", (id: number) => {
      runInAction(() => {
        this.messages = this.messages.filter((x) => x.id !== id);
      });
    });
  };

  stopHubConnection = () => {
    this.hubConnection
      ?.stop()
      .catch((error) => console.log("Error stopping connection: ", error));
  };

  clearMessages = () => {
    this.messages = [];
    this.stopHubConnection();
  };

  addMessage = async (values: any, username: string) => {
    values.chatName = this.chatName;
    values.senderUsername = store.accountStore.user?.username;
    values.receiverUsername = username;
    console.log("chat oce");
    //values.postId = store.postStore.selectedPost?.id;
    try {
      console.log(values);
      console.log(this.messages);
      await this.hubConnection?.invoke("SendMessage", values);
    } catch (error) {
      console.log(error);
    }
  };

  deleteMessage = async (id: number) => {
    try {
      await this.hubConnection?.invoke("DeleteMessage", 46);
    } catch (error) {
      console.log(error);
    }
  };

  getAllChatPartners = async () => {
    try {
      var chatPartners = await agent.Messages.getAllChatPartners();
      runInAction(() => {
        this.chatPartners = chatPartners;
        this.chatPartners.forEach((x) => {
          x.lastMessage.time = new Date(x.lastMessage.time);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  readMessage = async (id: number) => {
    try {
      await this.hubConnection?.invoke("ReadMessage", {
        id: id,
        chatName: this.chatName,
      });
    } catch (error) {
      console.log(error);
    }
  };

  readAllMessages = async () => {
    try {
      await this.hubConnection?.invoke("ReadAllMessages", {
        myUsername: store.accountStore.user?.username,
        username: this.chatPartnerUsername,
        chatName: this.chatName,
      });
    } catch (error) {
      console.log(error);
    }
  };
  checkForNewMessage = async () => {
    try {
      var numberOfUnseenMessagess = await agent.Messages.checkForNewMessage();
      runInAction(() => {
        this.numberOfUnseenMessages = numberOfUnseenMessagess;
      });
    } catch (error) {
      console.log(error);
    }
  };
}
