import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../app/stores/store";
import { Image, Item, Label, Segment, Comment } from "semantic-ui-react";
import { formatDistanceToNow } from "date-fns";
import { router } from "../../app/router/Router";


export default observer(function NotificationsDashboard() {
  const { messageStore, accountStore,notificationStore } = useStore();
//   useEffect(() => {
//     messageStore.getAllChatPartners().then(() => {
//       messageStore.checkForNewMessage();
//     });
//   }, [messageStore]);

  function truncate(content: string) {
    if (content)
      return content.length > 35 ? content.substring(0, 34) + "..." : content;
  }

  function openPost(postId: string) {
    console.log(postId);
    router.navigate(`/posts/${postId}`);
    // messageStore.getChatName(username).then(() => {
    //   router.navigate(`/chat/${username}/${messageStore.chatName}`);
    // });
  }

  return (
    <div className="div-inbox-hero">
      {notificationStore.notifications.length === 0 ? (
        <div className="forma-kreiranje-posta nema-vise">
          <div className="tekst-file">Nema notifikacija. Broj komentara na vasim postovima je 0!</div>
        </div>
      ) : null}
      {notificationStore.notifications.map((x) => (
        <div
          className="item"
          key={
           x.id
          }
        >
          
            <>
              <div className="item-left">
                <img
                  src=
                       "user.png"
                  
                />
                <div className="content">
                  <span className="header">{x.senderUsername} je komentarisao vas post</span>
                  <div className="description">
                   
                        <p>{truncate(x.comment)}</p>
                   
                  </div>

                  <div className="pre-koliko">
                    {formatDistanceToNow(x.time)} ago
                  </div>
                </div>
              </div>
              <div className="item-right">
                <button
                  onClick={() => {
                    openPost(x.postId);
                  }}
                  className="ui primary button"
                >
                  Pogledaj Post
                </button>
              </div>
            </>
           
        </div>
      ))}
    </div>
  );
});
