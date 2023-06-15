import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostForm } from "../../../app/domain/post";

import {
  Button,
  Container,
  Dropdown,
  Header,
  Input,
  Segment,
  TextArea,
} from "semantic-ui-react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import CustomSelectButton from "./CustomSelectButton";
import CustomTextArea from "./CustomTextArea";
import CustomTextInput from "./CustomTextInput";
import Swal from "sweetalert2";

export default observer(function FormPost() {
  const { postStore, accountStore } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostForm>(new PostForm());

  const validationSchema = Yup.object({
    title: Yup.string().required("Naslov je obavezan"),
    category: Yup.string().required(),
    content: Yup.string().required("Sadrzaj je obavezan"),
  });

  useEffect(() => {
    if (id) {
      postStore.loadingPost(id).then(() => {
        setPost(new PostForm(postStore.selectedPost));
      });
    }
  }, [postStore]);

  function submitChanges(post: PostForm) {
    if (post.id) {
      postStore.editPost(post).then(() => {
        navigate("/posts");
      });
    } else {
      postStore.createPost(post).then(() => {
        navigate("/posts");
        if (accountStore.user?.role !== "Administrator") {
          Swal.fire(
            "Uspešno ste kreirali post!",
            "Sačekajte na odobrenje administratora!",
            "success"
          );
        } else {
          Swal.fire("Uspešno ste kreirali post!", "💥", "success");
        }
      });
    }
  }

  function cancelChanges() {
    if (post.id) {
      navigate(`/posts/${post.id}`);
    } else navigate("/posts");
  }

  const optionsCategory = [
    {
      key: "trazenje cimera",
      text: "Traženje cimera",
      value: "Trazenje cimera",
    },
    {
      key: "trazenje knjiga",
      text: "Traženje knjiga",
      value: "Trazenje knjiga",
    },
    {
      key: "izgubljene stvari",
      text: "Izgubljene stvari",
      value: "Izgubljene stvari",
    },
    {
      key: "kartica za menzu",
      text: "Kartica za menzu",
      value: "Kartica za menzu",
    },
    {
      key: "trazenje saradnika",
      text: "Traženje saradnika",
      value: "Trazenje saradnika",
    },
    { key: "ostalo", text: "Ostalo", value: "Ostalo" },
  ];

  return (
    <Segment clearing className="detalji-posta-forma">
      <Header color="grey" content="Detalji posta" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={post}
        onSubmit={(values) => submitChanges(values)}
      >
        {({ handleSubmit, isSubmitting, isValid, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <CustomTextInput name="title" placeholder="Naslov" />
            <CustomSelectButton
              options={optionsCategory}
              placeholder="Kategorija"
              name="category"
            />
            <CustomTextArea placeholder="Sadržaj" name="content" row={7} />
            <Button
              onClick={() => postStore.setIncreaseNumberOfViews(false)}
              disabled={!isValid || !dirty || isSubmitting}
              type="submit"
              positive
              content={post.id ? "Izmeni" : "Kreiraj"}
              floated="right"
            />
            <Button
              onClick={cancelChanges}
              type="button"
              content="Poništi"
              floated="right"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
