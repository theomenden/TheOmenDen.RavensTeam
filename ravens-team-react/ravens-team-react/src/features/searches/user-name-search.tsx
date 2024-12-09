import React from "react";
import { Field, InputOnChangeData, SearchBox } from "@fluentui/react-components";
import type { SearchBoxChangeEvent } from "@fluentui/react-components";
import { Person16Regular } from "@fluentui/react-icons";

interface UsernameSearchBoxProps {
  onUsernameSearch: (value: string) => void;
}

export const UsernameSearchBox = ({ onUsernameSearch }: UsernameSearchBoxProps) => {
  const [value, setValue] = React.useState('');
  const [valid, setValid] = React.useState(true);

  const onChange: (ev: SearchBoxChangeEvent, data: InputOnChangeData) => void = (_, data) => {
    setValue(data.value);
    if (data.value.length <= 20 && data.value.length > 2) {
      setValid(true);
      return;
    }
    setValid(false);
  };
  if (valid) { onUsernameSearch(value); }
  return (
    <Field
      label="Search by Username"
      inputMode="text"
      validationState={valid ? "none" : "warning"}
      validationMessage={valid ? "" : "Please use at least 3 but no more than 20 characters"} >
      <div role="search">
        <SearchBox
          placeholder="Start typing here..."
          contentBefore={<Person16Regular />}
          value={value}
          onChange={onChange}
          aria-label="Search by Username"
          aria-describedby="search-field-description"
          size="small" />
      </div>
    </Field>
  );
};