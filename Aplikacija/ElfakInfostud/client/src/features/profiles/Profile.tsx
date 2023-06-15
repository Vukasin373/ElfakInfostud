import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Button, Header, Image } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Link, useParams } from "react-router-dom";
import { router } from "../../app/router/Router";
import PostListUser from "../posts/dashboard/PostListUser";
import PhotoUpload from "../photos/PhotoUpload";
import PostListProfile from "../posts/dashboard/PostListProfile";
import PostListUser2 from "../posts/dashboard/PostListUser2";

export default observer(function Profile() {
  const [photo, setPhoto] = useState(false);
  const { username } = useParams();
  const { postStore, profileStore, accountStore, messageStore, commonStore } =
    useStore();
  useEffect(() => {
    if (username) profileStore.loadProfile(username);
  }, [profileStore]);

  function openChat() {
    messageStore.getChatName(username!).then(() => {
      router.navigate(`/chat/${username}/${messageStore.chatName}`);
    });
  }
  return (
    <>
      <div className="container-myProfil">
        <div className="left-myProfil-hero">
          <div className="left-myProfil">
            <Image
              size="medium"
              src={
                profileStore.profile?.image
                  ? `data:image/jpeg;base64,${profileStore.profile?.image}`
                  : "/user.png"
              }
              style={{
                width: "200px",
                height: "auto",
              }}
            />
          </div>
          {commonStore.token ? (
            <div className="left-myProfile-buttons">
              {accountStore.user?.role === "Administrator" &&
              accountStore.user.username !==
                postStore.selectedPost?.authorUsername &&
              profileStore.profile?.role !== "Administrator" ? (
                <>
                  <Button
                    color="red"
                    content="Obriši nalog"
                    onClick={() => profileStore.deleteProfile(username!)}
                  />

                  <Button
                    color="green"
                    content="Promoviši"
                    onClick={() =>
                      profileStore.promoteToAdministrator(username!)
                    }
                  />
                </>
              ) : null}
              {accountStore.user?.username !== profileStore.profile?.username &&
              commonStore.token ? (
                <Button
                  onClick={openChat}
                  content="Pošalji poruku"
                  color="blue"
                />
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="right-myProfil">
          <div className="right-myProfil-About">
            <div>
              <h1>{profileStore.profile?.username}</h1>
            </div>
            <div>
              <h3>{profileStore.profile?.role}</h3>
            </div>
            <div>
              {profileStore.profile?.about ? (
                <p>{profileStore.profile?.about}</p>
              ) : (
                <p>Korisnik nije dodao opis...</p>
              )}
            </div>
          </div>
          <PostListUser2 />
        </div>
      </div>
    </>
  );
});
