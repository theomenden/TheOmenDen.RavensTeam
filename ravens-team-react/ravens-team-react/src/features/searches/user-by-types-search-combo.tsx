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

interface UserByTypesSearch {
    onFilterChange: (filter: string) => void;
    teamUsers: string[];
    selectedTeamUsers: string[];
    teamUsersFilter: string;
    teamUsersPlaceholder: string;
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

const UserByTypesSearch: React.FC<UserByTypesSearch> = ({ onFilterChange, teamUsers, selectedTeamUsers, teamUsersFilter, teamUsersPlaceholder }: UserByTypesSearch) => {
    const styles = useStyles();
    const comboId = useId("team-user-search");
    const selectedListId = `${comboId}-selection`;
    const selectedListRef = React.useRef<HTMLUListElement>(null);
    const comboboxInputRef = React.useRef<HTMLInputElement>(null);
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

    const onSelect: ComboboxProps["onOptionSelect"] = (event, data) => {
      setSelectedOptions(data.selectedOptions);
    };
    
    const handleFilterChange = (filter: string) => {
        onFilterChange(filter);
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
                icon={<DismissRegular fontSize={'12px'} />}
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
                aria-labelledby={labelledBy}
                id={comboId}
                placeholder={teamUsersPlaceholder}>
                    <OptionGroup label="Are they a(n):">
                        <Option key="partner">Partner</Option>
                        <Option key="affiliate">Affiliate</Option>
                        <Option key="regular">Regular</Option>
                    </OptionGroup>
                    <OptionGroup label="Are they live">
                        <Option key="live">Live</Option>
                        <Option key="offline">Offline</Option>
                    </OptionGroup>
            </Combobox>
        </div>

    );
}