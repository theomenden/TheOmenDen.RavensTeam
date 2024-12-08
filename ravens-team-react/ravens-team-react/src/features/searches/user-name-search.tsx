import * as React from "react";
import {
  Field,
  InputOnChangeData,
  SearchBox,
} from "@fluentui/react-components";
import type { SearchBoxChangeEvent } from "@fluentui/react-components";
import { Person16Color } from "@fluentui/react-icons";

export const Controlled = () => {
  const [value, setValue] = React.useState("initial value");
  const [valid, setValid] = React.useState(true);

  const onChange: (
    ev: SearchBoxChangeEvent,
    data: InputOnChangeData
  ) => void = (_, data) => {
    if (data.value.length <= 20) {
      setValue(data.value);
      setValid(true);
    } else {
      setValid(false);
    }
  };

  return (
    <Field
      label="Username Search - limited to 20 characters"
      validationState={valid ? "none" : "warning"}
      validationMessage={valid ? "" : "Input is limited to 20 characters."}
    >
      <SearchBox 
      placeholder="Type the start of a twitch user name here..." 
      contentBefore={<Person16Color/>} 
      value={value} 
      onChange={onChange}
      size="small" />
    </Field>
  );
};