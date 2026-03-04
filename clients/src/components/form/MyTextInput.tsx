import { useField } from "formik";
import { Form, Grid, Label } from "semantic-ui-react";
import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string; // required for Formik
  label: string; // required label text
  type?: "text" | "password" | "email" | "number"; // common types
  disabled?: boolean;
  // Add more if needed later (e.g. placeholder, className)
}

export default function MyTextInput({
  label,
  name,
  type = "text",
  disabled = false,
  ...props
}: TextInputProps) {
  const [field, meta] = useField(name);

  return (
    <div className="mb-4">
      <Grid>
        <Grid.Column verticalAlign="middle" width={5}>
          <label>{label}:</label>
        </Grid.Column>
        <Grid.Column verticalAlign="middle" width={11}>
          <Form.Field error={meta.touched && !!meta.error}>
            <input
              {...field}
              {...props}
              type={type}
              name={name}
              style={{ padding: "4px" }}
              disabled={disabled}
            />
          </Form.Field>
        </Grid.Column>
      </Grid>
      {meta.touched && meta.error ? (
        <Label
          basic
          color="red"
          style={{ marginTop: "10px", marginLeft: "122px" }}
        >
          {meta.error}
        </Label>
      ) : null}
    </div>
  );
}
