import { ErrorMessage, Form, Formik } from "formik";
import { Button, Header, Label, Segment } from "semantic-ui-react";
import CustomTextInput from "../posts/forms/CustomTextInput";
import { Link } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import modalStore from "../../app/stores/modalStore";

export default observer(function LoginForm() {
  const { accountStore } = useStore();

  return (
    <Segment clearing>
      <Formik
        initialValues={{ email: "", password: "", error: null }}
        onSubmit={(values, { setErrors }) =>
          accountStore
            .login(values)
            .catch((error) =>
              setErrors({ error: "Invalid password or email!" })
            )
        }
      >
        {({ handleSubmit, isSubmitting, errors }) => (
          <Form className="ui form" onSubmit={handleSubmit}>
            <Header
              as="h2"
              content="Prijavi se"
              color="teal"
              textAlign="center"
            />
            <CustomTextInput name="email" placeholder="Email" />
            <CustomTextInput
              name="password"
              placeholder="Password"
              type="password"
            />
            <ErrorMessage
              name="error"
              render={() => <Label basic color="red" content={errors.error} />}
            />
            <Button content="Prijavi se" type="submit" positive fluid />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
