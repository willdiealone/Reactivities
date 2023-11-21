import React, {PropsWithChildren, SyntheticEvent} from "react";
import {useField} from "formik";
import {Form, Label, Select, SelectProps} from 'semantic-ui-react'

interface Props {
    placeholder: string,
    name: string,
    options: any,
    label?: string
};
export default function SelectInput (props: Props) {
    const [field,meta, helpers] = useField(props.name);

    return(
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select 
                clearable
                options={props.options}
                value={field.value || null} 
                onChange={(e:SyntheticEvent<HTMLElement,Event>,d:any) => helpers.setValue(d.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}/>
            {meta.touched && meta.error ? (
                <Label basic color={"red"}>{meta.error}</Label>
            ) : null }
        </Form.Field>
    )
}
//:PropsWithChildren<SelectProps>
//SyntheticEvent<HTMLElement,Event>