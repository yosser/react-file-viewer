// Copyright (c) 2017 PlanGrid, Inc.

import React, { useEffect, useState } from "react";
import mammoth from "mammoth";

import "../../styles/docx.scss";

import { Loading } from "../Loading";

interface IDocxViewerProps {
    filePath: string;
    errorComponent?: React.ReactElement;
}

export const DocxViewer: React.FunctionComponent<IDocxViewerProps> = ({
    filePath,
    errorComponent,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [convertedFile, setConvertedFile] = useState<string>("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDoc = async () => {
            setLoading(true);
            setConvertedFile("");
            const reader = new FileReader();
            reader.onloadend = function () {
                const arrayBuffer = reader.result;
                if (arrayBuffer) {
                    mammoth
                        .convertToHtml(
                            { arrayBuffer: arrayBuffer as ArrayBuffer },
                            { includeDefaultStyleMap: true }
                        )
                        .then((result) => {
                            setConvertedFile(result.value);
                            setLoading(false);
                        })
                        .catch((a) => {
                            console.log("alexei: something went wrong", a);
                            setError("An error happened");
                            setLoading(false);
                        });
                }
            };
            const response = await fetch(filePath);
            reader.readAsArrayBuffer((await response.blob()) as Blob);
        };
        fetchDoc();
    }, [filePath]);

    return error ? (
        errorComponent
    ) : (
        <div id="docx" className="document-viewer">
            {loading ? (
                <Loading />
            ) : (
                <div dangerouslySetInnerHTML={{ __html: convertedFile }} />
            )}
        </div>
    );
};
