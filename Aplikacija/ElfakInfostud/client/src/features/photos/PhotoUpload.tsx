import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import axios from "axios";
import { Button, Input } from "semantic-ui-react";
import Swal from "sweetalert2";

export default observer(function PhotoUpload() {
  const { accountStore, postStore, profileStore } = useStore();
  const [image, setImage] = useState("");

  const handleFileInputChange = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      Swal.fire("Greška", "Morate da izaberete sliku", "error");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    try {
      const response = await fetch(
        `http://localhost:5293/api/photoUpload/uploadImage/${accountStore.user?.username}`,
        {
          method: "POST",
          body: formData,
        }
      );
      accountStore.user!.image = await response.text();
      postStore.changeAutorImage(accountStore.user!.image);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="photo-upload">
      <Input type="file" onChange={handleFileInputChange} />
      <div>
        <Button color="teal" onClick={handleUpload}>
          {accountStore.user?.image ? "Izmeni sliku" : "Postavi sliku"}
        </Button>
      </div>
    </div>
  );
});
