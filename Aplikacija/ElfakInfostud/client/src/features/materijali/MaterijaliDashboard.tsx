import { observer } from "mobx-react-lite";

import { useEffect, useState } from "react";
import { Dropdown, Icon } from "semantic-ui-react";
import Swal from "sweetalert2";
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/LoginForm";

export default observer(function MaterijaliDashboard() {
  const { commonStore, modalStore } = useStore();
  const [selectedFolder, setSelectedFolder] = useState(""); // Dodajte state za izabrani folder
  useEffect(() => {}, []);

  function zatvoriFolder() {
    document
      .querySelector(".materijali-lista")!
      .setAttribute("style", "display: none;");
  }

  async function uploadFile(event: any) {
    event.preventDefault();
    const fileInput = event.target.fileInput;
    const file = fileInput.files[0];

    if (selectedFolder === "" || file === undefined) {
      Swal.fire("Greška", "Morate popuniti sva tražena polja", "error");
      return;
    }

    if (!file.name.endsWith(".pdf")) {
      Swal.fire("Greška", "Fajl mora da bude u pdf formatu", "error");
      return;
    }

    if (file.size / (1024 * 1024) > 10) {
      Swal.fire("Greška", "Maksimalna veličina fajla je 10MB", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", selectedFolder); // Dodajte izabrani folder u FormData

    try {
      if (file) {
        const response = await fetch(
          "http://localhost:5293/api/FileUpload/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const result = await response.text();
        zatvoriFolder();
        Swal.fire("Uspešno ste dodali materijal!", "Hvala!", "success");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function downloadFile(imeFoldera: string, imeFajla: string) {
    try {
      const response = await fetch(
        `http://localhost:5293/api/FileUpload/vrati/${imeFoldera}/${imeFajla}`,
        {
          method: "GET",
        }
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function imenaFajlova(imeFoldera: string) {
    try {
      const response = await fetch(
        `http://localhost:5293/api/FileUpload/fajlovi/${imeFoldera}`,
        {
          method: "GET",
        }
      );
      const imenaFajlova = await response.json();
      if (!imenaFajlova) return;
      const lista = document.querySelector(".materijali-lista");
      while (lista!.firstChild) {
        lista!.removeChild(lista!.firstChild);
      }
      imenaFajlova.forEach((e: string) => {
        const d = document.createElement("button");
        d.innerHTML = e;
        d.className = "materijal-dugme";
        const materijal = document.createElement("div");
        materijal.className = "materijal";
        materijal.appendChild(d);
        d.addEventListener("click", () => {
          downloadFile(imeFoldera, e);
        });

        lista!.appendChild(materijal);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <div className="forma-file">
        <h1 className="h1-file">Podeli materijale sa kolegama</h1>
        <div className="tekst-file">
          Kolegijalnost je ono što krasi studentski život. Ukoliko posedujete
          sveske sa predavanja i vežbi, skripte ili bilo koje druge materijale u
          digitalnom obliku, pošaljite nam ih kako bi svi bili na jednom mestu.
        </div>
        {commonStore.token ? (
          <form className="uploadForm" onSubmit={uploadFile}>
            <Dropdown
              placeholder="Izaberite folder"
              selection
              options={[
                { key: "i-godina", text: "I godina", value: "i-godina" },
                { key: "ii-godina", text: "II godina", value: "ii-godina" },
                { key: "iii-godina", text: "III godina", value: "iii-godina" },
                { key: "iv-godina", text: "IV godina", value: "iv-godina" },
              ]}
              onChange={(e, { value }) => setSelectedFolder(value as string)}
            />
            <input type="file" id="fileInput" name="file" />
            <button className="button-c posalji-fajl-dugme" type="submit">
              Pošalji
            </button>
          </form>
        ) : (
          <p className="uploadForm uploadForm-prijava">
            <span
              className="prijavi-se-tekst"
              onClick={() => modalStore.openModal(<LoginForm />)}
            >
              Prijavi se
            </span>
            <span>da podeliš materijale sa kolegama.</span>
          </p>
        )}
      </div>
      <div className="materijali-lista-foldera">
        <div
          className="i-godina folder-u-listi"
          onClick={() => {
            imenaFajlova("i-godina");
            document
              .querySelector(".materijali-lista")!
              .setAttribute("style", "display: block;");
          }}
        >
          <div>
            <Icon name="folder outline" size="large" color="blue" />
          </div>
          I godina
        </div>
        <div
          className="ii-godina folder-u-listi"
          onClick={() => {
            imenaFajlova("ii-godina");
            document
              .querySelector(".materijali-lista")!
              .setAttribute("style", "display: block;");
          }}
        >
          <div>
            <Icon name="folder outline" size="large" color="blue" />
          </div>
          II godina
        </div>
        <div
          className="iii-godina folder-u-listi"
          onClick={() => {
            imenaFajlova("iii-godina");
            document
              .querySelector(".materijali-lista")!
              .setAttribute("style", "display: block;");
          }}
        >
          <div>
            <Icon name="folder outline" size="large" color="blue" />
          </div>
          III godina
        </div>
        <div
          className="iv-godina folder-u-listi"
          onClick={() => {
            imenaFajlova("iv-godina");
            document
              .querySelector(".materijali-lista")!
              .setAttribute("style", "display: block;");
          }}
        >
          <div>
            <Icon name="folder outline" size="large" color="blue" />
          </div>
          IV godina
        </div>
      </div>
      <div className="materijali-lista"></div>
    </div>
  );
});
