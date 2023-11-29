// Copyright (c) 2017 PlanGrid, Inc.

import React, { useState, useEffect } from "react";

import { Error } from "./Error";
import { Loading } from "./Loading";

import { CsvViewer, XlsxViewer } from "./drivers";

import { IDriverProps } from "./FileViewer";

export interface IFetchWrapperProps extends IDriverProps {
    childComponent: "xls" | "csv";
    responseType?: XMLHttpRequestResponseType;
}

export const FetchWrapper: React.FunctionComponent<IFetchWrapperProps> = (
    props
) => {
    const { childComponent, filePath } = props;
    const [data, setData] = useState<string>();
    const [dataArr, setDataArr] = useState<ArrayBuffer>();
    const [error, setError] = useState("");
    const [xhr, setXhr] = useState<XMLHttpRequest>();

    useEffect(() => {
        const initialise = () => {
            setData(undefined);
            setDataArr(undefined);
            const localXhr = createRequest(filePath);
            if (localXhr) {
                setXhr(localXhr);
                fetch(localXhr);
            }
        };
        initialise();
        return () => {
            abort();
        };
    }, [filePath, childComponent, props.childComponent]);

    const createRequest = (path: string) => {
        const localXhr = new XMLHttpRequest();

        if ("withCredentials" in localXhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            localXhr.open("GET", path, true);
        } else {
            // CORS not supported.
            return null;
        }
        if (props.responseType !== undefined) {
            localXhr.responseType = props.responseType;
        }

        localXhr.onload = () => {
            if (localXhr.status >= 400) {
                setError(`fetch error with status ${localXhr.status}`);
                return;
            }
            if (props.responseType === "arraybuffer") {
                setDataArr(localXhr.response as ArrayBuffer);
            } else {
                setData(localXhr.responseText);
            }
        };
        localXhr.onerror = () => {
            setError("fetch error");
        };
        //   setXhr(localXhr);
        return localXhr;
    };

    const fetch = (localXhr: XMLHttpRequest) => {
        if (localXhr) {
            localXhr.send();
        }
    };

    const abort = () => {
        if (xhr) {
            xhr.abort();
        }
    };

    return error ? (
        props.errorComponent ?? <Error error={error} />
    ) : xhr ? (
        childComponent === "csv" ? (
            data ? (
                <CsvViewer data={data} errorComponent={props.errorComponent} />
            ) : (
                <Loading />
            )
        ) : dataArr ? (
            <XlsxViewer data={dataArr} errorComponent={props.errorComponent} />
        ) : (
            <Loading />
        )
    ) : (
        <h1>CORS not supported</h1>
    );
};
