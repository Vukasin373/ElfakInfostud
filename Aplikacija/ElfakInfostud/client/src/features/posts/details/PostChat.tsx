import { Formik, Form, Field, FieldProps } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { Segment, Header, Comment, Loader, Button } from "semantic-ui-react";
import { store, useStore } from "../../../app/stores/store";
import * as Yup from "yup";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "react-router-dom";
import LoginForm from "../../users/LoginForm";

interface Props {
  postId: string;
}

export default observer(function PostChat({ postId }: Props) {
  const { id } = useParams();

  const { commentStore, commonStore, modalStore } = useStore();

  useEffect(() => {
    if (id) commentStore.createHubConnection(id);

    return () => commentStore.clearComments();
  }, [commentStore, id]);

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Komentari</Header>
      </Segment>

      {}
      <Segment attached clearing>
        {commonStore.token ? (
          <Formik
            onSubmit={(values, { resetForm }) =>
              commentStore.addComment(values).then(() => resetForm())
            }
            initialValues={{ content: "" }}
            validationSchema={Yup.object({
              content: Yup.string().required(),
            })}
          >
            {({ isSubmitting, isValid, handleSubmit }) => (
              <Form className="ui form">
                <Field name="content">
                  {(props: FieldProps) => (
                    <div style={{ position: "relative" }}>
                      <Loader active={isSubmitting} />
                      <textarea
                        placeholder="Postavi komentar..."
                        rows={2}
                        {...props.field}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.shiftKey) return;
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            isValid && handleSubmit();
                          }
                        }}
                      />
                    </div>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        ) : (
          <p className="komentari-slobodan-pristup">
            <span
              className="prijavi-se-tekst"
              onClick={() => modalStore.openModal(<LoginForm />)}
            >
              Prijavi se
            </span>
            <span>ako želiš da ostaviš komentar</span>
          </p>
        )}

        <div className="div-svi-komentari">
          {commentStore.comments.map((comment) => (
            <div className="div-komentar" key={comment.id}>
              <div className="div-komentar-levo">
                <img
                  className="slika-komentar"
                  src={
                    comment.image
                      ? `data:image/jpeg;base64,${comment.image}`
                      : "/user.png"
                  }
                />

                <div className="div-sadrzaj-komentara">
                  <Comment.Author>{comment.creatorUsername}</Comment.Author>

                  <Comment.Metadata>
                    <div>{formatDistanceToNow(comment.time)} ago</div>
                  </Comment.Metadata>
                  <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
                    {comment.content}
                  </Comment.Text>
                </div>
              </div>
              <div className="div-komentar-desno">
                {store.accountStore.user?.username ===
                comment.creatorUsername ? (
                  <Button
                    onClick={() => commentStore.deleteComment(comment.id)}
                    size="tiny"
                    floated="right"
                    color="red"
                    icon="trash"
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Segment>
    </>
  );
});
