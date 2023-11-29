// Copyright (c) 2017 PlanGrid, Inc.

import React, { useState } from "react";

import "../../styles/video.scss";
import { Loading } from "../Loading";

interface IAudioViewerProps {
    fileType: string;
    filePath: string;
    errorComponent?: React.ReactElement;
}

export const AudioViewer: React.FunctionComponent<IAudioViewerProps> = (
    props
) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<React.SyntheticEvent<
        HTMLAudioElement,
        Event
    > | null>(null);

    return error ? (
        props.errorComponent
    ) : (
        <div className="pg-driver-view">
            <div className="video-container">
                {loading ? <Loading /> : null}

                <audio
                    style={{ visibility: loading ? "hidden" : "visible" }}
                    controls
                    onCanPlay={() => setLoading(false)}
                    onError={(e) => setError(e)}
                    src={props.filePath}
                >
                    Audio playback is not supported by your browser.
                </audio>
            </div>
        </div>
    );
};
