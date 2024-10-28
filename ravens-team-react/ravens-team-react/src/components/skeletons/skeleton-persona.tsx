// src/components/SkeletonPersona.tsx
import React from 'react';
import {
    Skeleton,
    SkeletonItem,
    makeStyles,
    tokens,
  } from "@fluentui/react-components";
 import type { SkeletonProps } from "@fluentui/react-components";
import '../../styles/SkeletonPersona.scss';
const useStyles = makeStyles({
    invertedWrapper: {
      background: tokens.colorNeutralBackground1,
      display: "flex",
      padding: tokens.spacingHorizontalXL,
    },
    row: {
      display: "grid",
      gap: tokens.spacingHorizontalL,
      gridTemplateColumns: "1fr 150px 1fr",
    },
  });

export const SkeletonPersona: React.FC = (props: SkeletonProps) => {
    const styles = useStyles();
    return(
    <div className="skeleton-persona">
       <Skeleton {...props} className={styles.row} aria-label="Loading Content">
        <SkeletonItem size={48} shape="circle" className='skeleton-persona__image'/>
        <SkeletonItem size={56} shape="rectangle" className='skeleton-persona__display-name' />
        <SkeletonItem size={32} shape="rectangle" className='skeleton-persona__badge' />
      </Skeleton>
    </div>);
};