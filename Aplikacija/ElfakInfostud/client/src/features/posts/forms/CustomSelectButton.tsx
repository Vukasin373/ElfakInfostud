import { useField } from "formik";
import { Form, Select } from "semantic-ui-react";

interface Props {
    name: string;
    placeholder: string;
    options : any;
    label?:string;
}

export default function CustomSelectButton(props:Props){
    const [field,meta,helpers] = useField(props.name);
    return(
        <Form.Field error = {meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select
            clearable
            value = {field.value || null}
            placeholder={props.placeholder}
            onChange={(e,v)=> helpers.setValue(v.value)}
            options={props.options}
            onBlur={()=> helpers.setTouched(true)}
            />
        </Form.Field>
    )
}