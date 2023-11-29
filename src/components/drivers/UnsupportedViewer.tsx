// Copyright (c) 2017 PlanGrid, Inc.

import React from "react";

import "../../styles/unsupported.scss";

export interface IUnsupportedViewerProps {
    fileType: string;
    unsupportedComponent?: React.ReactElement;
}

export const UnsupportedViewer: React.FC<IUnsupportedViewerProps> = (props) => (
    <div className="pg-driver-view">
        <div className="unsupported-message">
            {props.unsupportedComponent ? (
                props.unsupportedComponent
            ) : (
                <p className="alert">
                    <b>{`.${props.fileType}`}</b> is not supported.
                </p>
            )}
        </div>
    </div>
);
