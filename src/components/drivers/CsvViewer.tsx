// Copyright (c) 2017 PlanGrid, Inc.

import React from "react";

import DataGrid, { Column } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import CSV from "comma-separated-values";

import "../../styles/csv.scss";

interface ICsvViewerProps {
    data: string;
    errorComponent?: React.ReactElement;
}

export const CsvViewer: React.FunctionComponent<ICsvViewerProps> = (props) => {
    const parse = (
        data: string
    ): { columns: Column<string>[]; rows: Array<Record<string, string>> } => {
        const rows: Array<Record<string, string>> = [];
        const columns: Column<string>[] = [];

        new CSV(data).forEach((array: string[]) => {
            if (columns.length < 1) {
                array.forEach((cell, idx) => {
                    columns.push({
                        key: `key-${idx}`,
                        name: cell,
                        resizable: true,
                        sortable: true,
                        filterable: true,
                    });
                });
            } else {
                const row: Record<string, string> = {};
                array.forEach((cell, idx) => {
                    row[`key-${idx}`] = cell.toString();
                });

                rows.push(row);
            }
        });

        return { rows, columns };
    };
    const { rows, columns } = parse(props.data);

    return rows.length > 0 && columns.length > 0 ? (
        <div className="pg-csv-viewer">
            <DataGrid
                //@ts-expect-error - react-data-grid types are not up to date
                columns={columns}
                rows={rows}
                minHeight={1000}
            />
        </div>
    ) : null;
};
