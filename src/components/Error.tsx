// Copyright (c) 2017 PlanGrid, Inc.

import React from "react";

import "../styles/error.scss";

export interface IErrorProps {
    error: string;
    children?: React.ReactElement;
}

export const Error: React.FunctionComponent<IErrorProps> = (props) => (
    <div className="error-message">
        {props.children ? (
            props.children
        ) : (
            <p className="alert">{props.error}</p>
        )}
    </div>
);
