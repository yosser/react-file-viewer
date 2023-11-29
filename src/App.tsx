// Copyright (c) 2017 PlanGrid, Inc.

import React from "react";

import "./styles/main.scss";

import { FileViewer } from "./components/FileViewer";

const files = [
    { type: "wexbim", name: "SampleHouse.wexbim" },
    { type: "jpg", name: "02-USVI-Solar.jpg" },
    { type: "docx", name: "SampleSpec.docx" },
    { type: "mp3", name: "sample.mp3" },
    { type: "pdf", name: "sample.pdf" },
    { type: "csv", name: "Total_Crime.csv" },
    { type: "mp4", name: "small.mp4" },
    { type: "xlsx", name: "SimpleSpreadsheet.xlsx" },
    { type: "jpg", name: "360photo.jpg" },
    { type: "webm", name: "small.webm" },
];

const ErrorComponent: React.ReactElement = <div>There was an error</div>;

export const App = () => {
    const [fileType, setFileType] = React.useState<{
        type: string;
        name: string;
    }>(files[1]);

    return (
        <div>
            <select
                value={fileType.name}
                onChange={(e) =>
                    setFileType(
                        files.find((f) => f.name === e.target.value) || {
                            type: "",
                            name: "",
                        }
                    )
                }
            >
                {files.map((file) => (
                    <option key={file.name} value={file.name}>
                        {file.type} {file.name}
                    </option>
                ))}
            </select>
            {fileType && (
                <div>
                    <div style={{ width: "500px", height: "400px" }}>
                        <FileViewer
                            fileType={fileType.type}
                            filePath={`/example_files/${fileType.name}`}
                            errorComponent={ErrorComponent}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
