// Copyright (c) 2017 PlanGrid, Inc.

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import { CsvViewer } from "./CsvViewer";

interface IXlsxViewerProps {
    data: ArrayBuffer;
    errorComponent?: React.ReactElement;
}

export const XlsxViewer: React.FunctionComponent<IXlsxViewerProps> = (
    props
) => {
    const [sheets, setSheets] = useState<string[]>([]);
    const [names, setNames] = useState<string[]>([]);
    const [curSheetIndex, setCurSheetIndex] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        const dataArr = new Uint8Array(props.data);
        const arr = [];

        for (let i = 0; i !== dataArr.length; i += 1) {
            arr.push(String.fromCharCode(dataArr[i]));
        }
        try {
            const workbook = XLSX.read(arr.join(""), { type: "binary" });
            const names = Object.keys(workbook.Sheets);
            const sheets = names.map((name) =>
                XLSX.utils.sheet_to_csv(workbook.Sheets[name])
            );
            setSheets(sheets);
            setNames(names);
            setCurSheetIndex(0);
        } catch (e) {
            setError("Error converting file to CSV");
        }
    }, [props.data]);

    return error ? (
        props.errorComponent
    ) : (
        <div className="spreadsheet-viewer">
            <div className="sheet-names">
                {names.map((name, index) => (
                    <input
                        key={name}
                        type="button"
                        value={name}
                        onClick={() => {
                            setCurSheetIndex(index);
                        }}
                    />
                ))}
            </div>
            {sheets.length > 0 && null != sheets[curSheetIndex || 0] ? (
                <CsvViewer data={sheets[curSheetIndex || 0]} />
            ) : null}
        </div>
    );
};
