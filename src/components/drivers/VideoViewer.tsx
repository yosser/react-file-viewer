// Copyright (c) 2017 PlanGrid, Inc.

import React, { useState } from "react";

import "../../styles/video.scss";
import { Loading } from "../Loading";

interface IVideoViewerProps {
    fileType: string;
    filePath: string;
    errorComponent?: React.ReactElement;
}

export const VideoViewer: React.FunctionComponent<IVideoViewerProps> = (
    props
) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<React.SyntheticEvent<
        HTMLVideoElement,
        Event
    > | null>(null);

    return error ? (
        props.errorComponent
    ) : (
        <div className="pg-driver-view">
            <div className="video-container">
                {loading ? <Loading /> : null}
                <video
                    style={{ visibility: loading ? "hidden" : "visible" }}
                    controls
                    onCanPlay={() => setLoading(false)}
                    onError={(e) => setError(e)}
                    src={props.filePath}
                >
                    Video playback is not supported by your browser.
                </video>
            </div>
        </div>
    );
};
