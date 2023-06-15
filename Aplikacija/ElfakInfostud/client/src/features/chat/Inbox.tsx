import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../app/stores/store";
import { Image, Item, Label, Segment, Comment } from "semantic-ui-react";
import { formatDistanceToNow } from "date-fns";
import { router } from "../../app/router/Router";

export default observer(function Inbox() {
  const { messageStore, accountStore } = useStore();
  useEffect(() => {
    messageStore.getAllChatPartners().then(() => {
      messageStore.checkForNewMessage();
    });
  }, [messageStore]);

  function truncate(content: string) {
    if (content)
      return content.length > 35 ? content.substring(0, 34) + "..." : content;
  }

  function openChat(username: string) {
    console.log(username);
    messageStore.getChatName(username).then(() => {
      router.navigate(`/chat/${username}/${messageStore.chatName}`);
    });
  }

  return (
    <div className="div-inbox-hero">
      {messageStore.chatPartners.length === 0 ? (
        <div className="forma-kreiranje-posta nema-vise">
          <div className="tekst-file">Nema poruka. Inbox je prazan!</div>
        </div>
      ) : null}
      {messageStore.chatPartners.map((x) => (
        <div
          className="item"
          key={
            accountStore.user?.username === x.lastMessage.senderUsername
              ? x.lastMessage.receiverUsername
              : x.lastMessage.senderUsername
          }
        >
          {x.profile ? (
            <>
              <div className="item-left">
                <img
                  src={
                    x.profile?.image
                      ? `data:image/jpeg;base64,${x.profile?.image}`
                      : "user.png"
                  }
                />
                <div className="content">
                  <span className="header">{x.profile.username}</span>
                  <div className="description">
                    {!x.lastMessage.seen ? (
                      x.lastMessage.senderUsername ===
                      accountStore.user?.username ? (
                        <p>{truncate(x.lastMessage.content)}</p>
                      ) : (
                        <p style={{ fontWeight: "bold" }}>
                          {truncate(x.lastMessage.content)}
                        </p>
                      )
                    ) : (
                      <p>{truncate(x.lastMessage.content)}</p>
                    )}
                  </div>

                  <div className="pre-koliko">
                    {formatDistanceToNow(x.lastMessage.time)} ago
                  </div>
                </div>
              </div>
              <div className="item-right">
                <button
                  onClick={() => {
                    openChat(x.profile.username);
                  }}
                  className="ui primary button"
                >
                  Otvori razgovor
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="item-left">
                <img src="user.png" />
                <div className="content">
                  <div style={{ color: "red" }}>
                    <label>Profil obrisan</label>
                  </div>
                  <span className="header">
                    {accountStore.user?.username ===
                    x.lastMessage.senderUsername
                      ? x.lastMessage.receiverUsername
                      : x.lastMessage.senderUsername}
                  </span>
                  <div className="description">
                    <p>{truncate(x.lastMessage.content)}</p>
                  </div>

                  <div className="pre-koliko">
                    {formatDistanceToNow(x.lastMessage.time)} ago
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
});
