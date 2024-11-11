import React from 'react';
import {Skeleton, SkeletonItemProps, Card, makeStyles, SkeletonItem, Spinner} from '@fluentui/react-components';

const useStyles = makeStyles({
    firstRow: {
        alignItems: "center",
        display: "grid",
        paddingBottom: "10px",
        position: "relative",
        gap: "10px",
        gridTemplateColumns: "min-content 80%",
      },
      secondThirdRow: {
        alignItems: "center",
        display: "grid",
        paddingBottom: "10px",
        position: "relative",
        gap: "10px",
        gridTemplateColumns: "min-content 20% 20% 15% 15%",
      }
    });

export const PopOverSkeleton: React.FC = () => { 
    const styles = useStyles();
    return(
        <div>
    <div className={styles.firstRow}>
      <SkeletonItem shape="circle" size={24} />
      <SkeletonItem shape="rectangle" size={16} />
    </div>
    <div className={styles.secondThirdRow}>
      <SkeletonItem size={16} />
      <SkeletonItem size={16} />
      <SkeletonItem size={16} />
      <SkeletonItem size={16} />
    </div>
    <Spinner appearance='primary' label={'Loading list data...'} labelPosition='before' />
  </div>
    );
}