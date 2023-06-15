import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { Button, Comment, Header, Loader, Segment } from "semantic-ui-react";
import { Field, FieldProps, Form, Formik } from "formik";
import * as Yup from "yup";
import { formatDistanceToNow } from "date-fns";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default observer(function ChatPage() {
  const { chatName, username } = useParams();
  const { messageStore, accountStore, profileStore } = useStore();
  useEffect(() => {
    profileStore.loadProfile(username!).then(() => {
      messageStore.chatPartnerUsername = username!;

      if (chatName) {
        messageStore.chatName = chatName;
        messageStore.createHubConnection(chatName);
      }
    });

    return () => messageStore.clearMessages();
  }, [messageStore, chatName]);

  if (!profileStore.profile) return <LoadingComponent />;

  return (
    <>
      <Segment
        size="tiny"
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Razgovor sa {username}</Header>
      </Segment>

      <Segment attached>
        <div className="div-sve-poruke">
          {messageStore.messages.map((message, index) => (
            <div
              key={message.id}
              className={
                message.senderUsername === accountStore.user?.username
                  ? "right"
                  : "left"
              }
            >
              <img
                src={
                  message.senderUsername === accountStore.user?.username
                    ? accountStore.user.image !== null
                      ? `data:image/jpeg;base64,${accountStore.user?.image}`
                      : "/user.png"
                    : profileStore.profile!.image !== null
                    ? `data:image/jpeg;base64,${profileStore.profile!.image}`
                    : "/user.png"
                }
              />
              <div className="div-poruka">
                <h4>
                  {accountStore.user?.username !== message.senderUsername
                    ? message.senderUsername
                    : null}
                </h4>

                <p className="vreme">{formatDistanceToNow(message.time)} ago</p>
                <p
                  className="sadrzaj-poruke"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {message.content}
                </p>

                {message.senderUsername === accountStore.user?.username &&
                index === messageStore.messages.length - 1 ? (
                  <div className="seen-sent">
                    {message.seen ? "Seen" : "Sent"}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <Formik
          onSubmit={(values, { resetForm }) =>
            messageStore.addMessage(values, username!).then(() => resetForm())
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
                  <div
                    className="oko-textarea"
                    style={{ position: "relative" }}
                  >
                    <Loader active={isSubmitting} />
                    <textarea
                      placeholder="Pošalji poruku..."
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
      </Segment>
    </>
  );
});
