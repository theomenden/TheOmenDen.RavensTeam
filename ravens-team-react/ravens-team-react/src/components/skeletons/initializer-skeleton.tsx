import * as React from "react";
import {RowSkeleton} from "./row-skeleton.tsx";
import { Divider } from "@fluentui/react-divider";

const rows = Array.from({length: 5}, (_, index) => index);
export const TableSkeleton = () => {
    return (
        <div>
            {rows.map((_, index) => (
                <RowSkeleton key={index} />
            ))}
        </div>
    );
}
