// Copyright (c) 2017 PlanGrid, Inc.

import React, { useRef } from "react";

import "../styles/main.scss";
import { FetchWrapper } from "./FetchWrapper";

import {
    DocxViewer,
    VideoViewer,
    XBimViewer,
    PDFViewer,
    UnsupportedViewer,
    PhotoViewerWrapper,
    AudioViewer,
} from "./drivers";

export interface IFileViewerProps {
    fileType: string;
    filePath: string;
    onError?: (e: Error) => void;
    errorComponent?: React.ReactElement;
    unsupportedComponent?: React.ReactElement;
}

export const FileViewer: React.FunctionComponent<IFileViewerProps> = (
    props
) => {
    const container = useRef<HTMLDivElement>(null);

    return (
        <div className="pg-viewer-wrapper">
            <div className="pg-viewer" id="pg-viewer" ref={container}>
                <Driver {...props} />
            </div>
        </div>
    );
};

export interface IDriverProps extends IFileViewerProps {
    width?: number;
    height?: number;
}

const Driver: React.FunctionComponent<IDriverProps> = (props) => {
    const { fileType } = props;
    switch (fileType) {
        case "csv": {
            return (
                <FetchWrapper {...props} childComponent={"csv"}></FetchWrapper>
            );
        }
        case "xlsx": {
            return (
                <FetchWrapper
                    {...props}
                    responseType="arraybuffer"
                    childComponent="xls"
                ></FetchWrapper>
            );
        }
        case "jpg":
        case "jpeg":
        case "gif":
        case "bmp":
        case "png": {
            return <PhotoViewerWrapper {...props} />;
        }
        case "pdf": {
            return <PDFViewer {...props} />;
        }
        case "docx": {
            return <DocxViewer {...props} />;
        }
        case "mp3": {
            return <AudioViewer {...props} />;
        }
        case "webm":
        case "mov":
        case "mp4": {
            return <VideoViewer {...props} />;
        }
        case "wexbim": {
            return <XBimViewer {...props} />;
        }
        default: {
            return <UnsupportedViewer fileType={props.fileType} />;
        }
    }
};
