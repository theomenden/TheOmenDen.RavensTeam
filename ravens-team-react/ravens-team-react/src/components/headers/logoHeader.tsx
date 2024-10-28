import * from 'react';
import {makeStyles, mergeClasses, Card, CardPreview, CardHeader, CardFooter} from '@fluentui/react-components';
const useStyles = makeStyles({
    container: {
      gap: "16px",
      display: "flex",
      flexWrap: "wrap",
    },
  
    card: {
      width: "280px",
      height: "fit-content",
    },
  
    flex: {
      gap: "4px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
  
    labels: { gap: "6px" },
  
    footer: { gap: "12px" },
  
    caption: {
      color: tokens.colorNeutralForeground3,
    },
  
    taskCheckbox: {
      display: "flex",
      alignItems: "flex-start",
    },
  
    grid: {
      gap: "16px",
      display: "flex",
      flexDirection: "column",
    },
  });
  
export const LogoHeader = () => {
    const classes = useStyles();
    return (
        <Card className={mergeClasses(classes.logoHeader, classes.card)}>
            <CardPreview>
                <img src={omendenRhombus} alt="The Omen Den L.L.C." width="256" height="128" />
            </CardPreview>
            <CardHeader
                className={classes.cardHeader}
                text="The Omen Den L.L.C."
                title="Logo"
                iconProps={{ iconName: 'Logo', size: 32 }}
            />
            <CardFooter className={classes.cardFooter} text="Logo" />
        </Card>
    );
};