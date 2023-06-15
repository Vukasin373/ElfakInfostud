import { ErrorMessage, Form, Formik } from "formik";
import { Button, Header, Segment } from "semantic-ui-react";
import * as Yup from "yup";
import CustomTextInput from "../posts/forms/CustomTextInput";
import ValidationError from "../errors/ValidationError";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function RegisterForm() {
  const validationSchema = Yup.object({
    username: Yup.string()
      .required()
      .matches(/^[a-zA-Z0-9]+$/, "username is not valid"),
    email: Yup.string().required().email(),
    password: Yup.string().required(),
  });

  const { accountStore } = useStore();

  return (
    <Segment>
      <Formik
        initialValues={{ username: "", email: "", password: "", error: null }}
        onSubmit={(values, { setErrors }) =>
          accountStore.register(values).catch((error) => setErrors({ error }))
        }
        validationSchema={validationSchema}
      >
        {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
          <Form className="ui form error" onSubmit={handleSubmit}>
            <Header
              as="h2"
              content="Registruj se"
              color="teal"
              textAlign="center"
            />
            <CustomTextInput name="username" placeholder="Username" />
            <CustomTextInput name="email" placeholder="Email" />
            <CustomTextInput
              name="password"
              placeholder="Password"
              type="password"
            />
            <ErrorMessage
              name="error"
              render={() => <ValidationError errors={errors.error} />}
            />
            <Button
              disabled={!isValid || !dirty || isSubmitting}
              positive
              content="Registruj se"
              type="submit"
              fluid
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
