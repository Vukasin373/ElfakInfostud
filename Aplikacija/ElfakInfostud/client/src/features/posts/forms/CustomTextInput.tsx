import { useField } from "formik";
import { Form, Input, Label } from "semantic-ui-react";

interface Props {
    name : string;
    placeholder: string;
    label? : string;
    type? : string;
}

export default function CustomTextInput(props:Props){
    const [field, meta] = useField(props.name);
    return(
        <Form.Field error = {meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Input {...field} {...props} />
            {meta.touched && !!meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ): null}
        </Form.Field>
    )
}