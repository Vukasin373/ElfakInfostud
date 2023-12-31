import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
    name : string;
    label? : string;
    placeholder : string;
    row : number;
}

export default function CustomTextArea (props:Props) {

    const [field,meta] = useField(props.name);
    return(
        <Form.Field error = {meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <textarea {...field} {...props}/>
            {meta.touched && meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ):null}
        </Form.Field>
    )
}