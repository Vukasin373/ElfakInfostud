import { observer } from "mobx-react-lite";
import { Image } from "semantic-ui-react";
import PhotoUpload from "../photos/PhotoUpload";
import { useStore } from "../../app/stores/store";
import { useState, useEffect } from "react";
import PostList from "../posts/dashboard/PostList";
import PostListUser from "../posts/dashboard/PostListUser";
import { set } from "date-fns";
import UpdateAbout from "./UpdateAbout";
import ProfileStore from "../../app/stores/profileStore";

export default observer(function MyProfile() {
  const { accountStore, profileStore, postStore } = useStore();
  const [photo, setPhoto] = useState(false);
  const [about, setAbout] = useState(false);

  return (
    <>
      <div className="container-myProfil">
        <div className="left-myProfil">
          <Image
            size="medium"
            src={
              accountStore.user?.image
                ? `data:image/jpeg;base64,${accountStore.user?.image}`
                : "/user.png"
            }
            style={{
              width: "200px",
              height: "auto",
            }}
          />
          <i className="edit icon" onClick={() => setPhoto(true)}></i>
        </div>
        <div className="right-myProfil">
          {photo && (
            <div className="upload-photo-div">
              <PhotoUpload />
              <button
                className="upload-photo-div-dugme-izadji"
                onClick={() => setPhoto(false)}
              >
                X
              </button>
            </div>
          )}

          {about && (
            <div className="update-about-div">
              <UpdateAbout />
              <button
                className="update-about-div-dugme-izadji"
                onClick={() => setAbout(false)}
              >
                X
              </button>
            </div>
          )}
          <div className="right-myProfil-About">
            <div>
              <h1>{accountStore.user?.username}</h1>
            </div>
            <div>
              <h3>{accountStore.user?.role}</h3>
            </div>
            <div>
              {accountStore.user?.about ? (
                <p>{accountStore.user?.about}</p>
              ) : (
                <p>Korisnik nije dodao opis...</p>
              )}
            </div>
            <i
              className="edit icon edit-about"
              onClick={() => setAbout(true)}
            ></i>
          </div>
          <PostListUser />
        </div>
      </div>
    </>
  );
});
