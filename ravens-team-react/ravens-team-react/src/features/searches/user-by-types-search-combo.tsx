import React from "react";
import {
    Button,
    Combobox,
    makeStyles,
    Option,
    OptionGroup,
    tokens,
    useId,
} from "@fluentui/react-components";
import type { ComboboxProps } from "@fluentui/react-components";
import { Dismiss12Regular, DismissRegular } from "@fluentui/react-icons";
import { UserFilters } from "../../utils/search-types/broadcaster-types";

interface UserByTypesSearch {
    onFilterChange: (filters: UserFilters) => void;
}

const useStyles = makeStyles({
    root: {
        // Stack the label above the field with a gap
        display: "grid",
        gridTemplateRows: "repeat(1fr)",
        justifyItems: "start",
        gap: "2px",
        maxWidth: "400px",
    },
    tagsList: {
        listStyleType: "none",
        marginBottom: tokens.spacingVerticalXXS,
        marginTop: 0,
        paddingLeft: 0,
        display: "flex",
        gridGap: tokens.spacingHorizontalXXS,
      },
});

export const UserByTypesSearch: React.FC<UserByTypesSearch> = ({ onFilterChange }: UserByTypesSearch) => {
    const styles = useStyles();
    const comboId = useId("team-user-search");
    const selectedListId = `${comboId}-selection`;
    const selectedListRef = React.useRef<HTMLUListElement>(null);
    const comboboxInputRef = React.useRef<HTMLInputElement>(null);
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

    const onSelect: ComboboxProps["onOptionSelect"] = (event, data) => {
      setSelectedOptions(data.selectedOptions);
      const broadcasterType = data.selectedOptions.filter((o) => ["partner", "affiliate", "regular"].includes(o as string)) as string[];
      const userType = data.selectedOptions.filter((o) => ["staff", "admin", "global_mod", "normal"].includes(o as string)) as string[];
      const isBroadcasterLive = data.selectedOptions.includes("live");
      onFilterChange({ broadcasterTypes: [...broadcasterType], userTypes: [...userType], isBroadcasterLive });
    };

    const onTagClick = (option: string, index: number) => {
        // remove selected option
        setSelectedOptions(selectedOptions.filter((o) => o !== option));
    
        // focus previous or next option, defaulting to focusing back to the combo input
        const indexToFocus = index === 0 ? 1 : index - 1;
        const optionToFocus = selectedListRef.current?.querySelector(
          `#${comboId}-remove-${indexToFocus}`
        );
        if (optionToFocus) {
          (optionToFocus as HTMLButtonElement).focus();
        } else {
          comboboxInputRef.current?.focus();
        }
      };
      const labelledBy =
      selectedOptions.length > 0 ? `${comboId} ${selectedListId}` : comboId;
    return (
        <div className={styles.root}>
        {selectedOptions.length ? (
        <ul
          id={selectedListId}
          className={styles.tagsList}
          ref={selectedListRef}
        > 
          {/* The "Remove" span is used for naming the buttons without affecting the Combobox name */}
          <span id={`${comboId}-remove`} hidden>
            Remove
          </span>
          {selectedOptions.map((option, i) => (
            <li key={option}>
              <Button
                size="small"
                shape="circular"
                appearance="primary"
                icon={<Dismiss12Regular />}
                iconPosition="after"
                onClick={() => onTagClick(option, i)}
                id={`${comboId}-remove-${i}`}
                aria-labelledby={`${comboId}-remove ${comboId}-remove-${i}`}
              >
                {option}
              </Button>
            </li>
          ))}
        </ul>
      ) : null }
            <Combobox
                multiselect={true}
                ref={comboboxInputRef}
                selectedOptions={selectedOptions}
                onOptionSelect={onSelect}
                aria-labelledby={labelledBy}
                id={comboId}
                placeholder='filter by...'>
                    <OptionGroup label="Are they a(n):">
                        <Option key="partner" value="partner">Partner</Option>
                        <Option key="affiliate" value="affiliate">Affiliate</Option>
                        <Option key="regular" value="regular">Regular</Option>
                    </OptionGroup>
                    <OptionGroup label="Are they a(n):">
                        <Option key="staff" value="staff">Staff</Option>
                        <Option key="admin" value="admin">Admin</Option>
                        <Option key="globalModerator" value="global_mod">Global Moderator</Option>
                        <Option key="normal" value="normal">Normal</Option>
                    </OptionGroup>
            </Combobox>
        </div>

    );
}