import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import axios from "axios";
import { Button, Input } from "semantic-ui-react";
import ProfileStore from "../../app/stores/profileStore";
import { runInAction } from "mobx";
import Swal from "sweetalert2";

export default observer(function UpdateAbout() {
  const { accountStore, postStore, profileStore } = useStore();
  const [about, setAbout] = useState("");

  const handleAboutInputChange = (e: any) => {
    setAbout(e.target.value);
  };

  const handleUpload = async () => {
    if (!about) {
      Swal.fire("Greška", "Niste uneli opis", "error");
      return;
    }
    try {
      await profileStore.setAuthorAbout(accountStore.user!.username, about);
      console.log(accountStore.user!.username);
      console.log(about);
      runInAction(() => {
        accountStore.postaviAbout(about);
        profileStore.setAuthorAbout(accountStore.user!.username, about);
      });
    } catch (error) {
      console.error("Error updating about:", error);
    }
  };

  return (
    <div className="update-about">
      <Input type="text" onChange={handleAboutInputChange} />
      <div>
        <Button color="teal" onClick={handleUpload}>
          Izmeni About
        </Button>
      </div>
    </div>
  );
});
