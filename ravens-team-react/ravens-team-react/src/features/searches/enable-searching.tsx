import * as React from "react";
import { Switch, makeStyles, tokens } from "@fluentui/react-components";
import { Filter16Filled, FilterDismiss16Filled } from "@fluentui/react-icons";
const useStyles = makeStyles(
    {
        wrapper: {
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: tokens.spacingHorizontalS,
            marginBottom: tokens.spacingVerticalS,
        }
    });

interface EnableSearchSwitchProps {
    onSwitchChange: (checked: boolean) => void;
}

export const EnableSearchSwitch: React.FC<EnableSearchSwitchProps> = ({ onSwitchChange }: EnableSearchSwitchProps) => {
    const [isChecked, setChecked] = React.useState(false);
    const styles = useStyles();
    const onChange = React.useCallback(
        (ev: { currentTarget: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
            setChecked(ev.currentTarget.checked);
        },
        [setChecked]
    );
    const checkedIcon = isChecked ? <Filter16Filled /> : <FilterDismiss16Filled />;
    return (
        <div className={styles.wrapper}>
            <Switch
                checked={isChecked}
                onChange={onChange}
                label={checkedIcon}
                labelPosition="after"
            />
        </div>
    );
};