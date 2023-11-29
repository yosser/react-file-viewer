// Copyright (c) 2017 PlanGrid, Inc.

import React, { useState, useEffect, useRef } from "react";
//import XViewer from "../../utils/xbim-viewer.debug.bundle";
import { Viewer, ViewType } from "@xbim/viewer";

import { Error } from "../Error";
import { set } from "js-cookie";

interface IXbimViewerProps {
    filePath: string;
    onError?: (e: Error) => void;
}

export const XBimViewer: React.FunctionComponent<IXbimViewerProps> = (
    props
) => {
    const loaded = useRef<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    //    const [mo]
    useEffect(() => {
        const doLoad = async () => {
            try {
                const viewer = new Viewer("viewer");

                viewer.load(props.filePath);
                viewer.on("loaded", () => {
                    viewer.show(ViewType.DEFAULT);
                });
                viewer.start();
                set;
            } catch (e) {
                if (props.onError) {
                    props.onError(e as Error);
                }
                setError(e as Error);
            }
        };
        if (!loaded.current && props.filePath) {
            loaded.current = true;
            doLoad();
        }
    }, [props.filePath]);

    return error ? (
        <Error error={error.message} />
    ) : (
        <div className="pg-driver-view">
            <canvas id="viewer" width="500" height="300" />
        </div>
    );
};
