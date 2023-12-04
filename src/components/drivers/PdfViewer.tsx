// Copyright (c) 2017 PlanGrid, Inc.

import React, { useEffect, useRef, useState } from "react";

import { Document, Page } from "react-pdf";

//import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
//import "pdfjs-dist/build/pdf.worker";
//import * as pdfjs from "pdfjs-dist/build/pdf.worker.js";

import "../../styles/pdf-viewer.scss";
//import "pdf.worker";
//const src = new URL("pdfjs-dist/build/pdf.worker.js", import.meta.url);

//import * as pdfjs from "pdfjs-dist";
//const src = new URL("pdfjs-dist/build/pdf.worker.js", import.meta.url);
//pdfjs.GlobalWorkerOptions.workerSrc = src.toString();

interface IPDFViewerProps {
    filePath: string;
    errorComponent?: React.ReactElement;
}

const base64FromArraybuffer = async (data: Uint8Array) => {
    // Use a FileReader to generate a base64 data URI
    const base64url: string = await new Promise((r) => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result as string);
        reader.readAsDataURL(new Blob([data]));
    });

    /*
  The result looks like
  "data:application/octet-stream;base64,<your base64 data>",
  so we split off the beginning:
  */

    return base64url.split(",", 2)[1];
};

export const PDFViewer: React.FunctionComponent<IPDFViewerProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasLoaded = useRef<boolean>(false);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [pdf, setPdf] = useState<string>("");
    const [zoom, setZoom] = useState<number>(0);
    const [percent, setPercent] = useState<string>("0");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPdf = async () => {
            const container = containerRef.current;
            if (container) {
                const { width } = containerRef.current.getBoundingClientRect();
                setContainerWidth(width);
            }
            setLoading(true);
            fetch(props.filePath)
                .then((p) => {
                    const buff = p.arrayBuffer();
                    buff.then((text) => {
                        const report = new Uint8Array(text);
                        base64FromArraybuffer(report).then((pdf) => {
                            setPdf(pdf);
                            setLoading(false);
                        });
                    });
                })
                .catch(() => {
                    setLoading(false);
                });
        };
        if (props.filePath && !hasLoaded.current) {
            hasLoaded.current = true;
            //     pdfjs.GlobalWorkerOptions.workerSrc = src.toString();
            fetchPdf();
        }
    }, [props.filePath]);

    const progressCallback = (progress: { loaded: number; total: number }) => {
        const percent = ((progress.loaded / progress.total) * 100).toFixed();
        setPercent(percent);
    };

    const reduceZoom = () => {
        setZoom(Math.max(zoom - 1, 0));
    };

    const increaseZoom = () => setZoom(zoom + 1);

    const resetZoom = () => setZoom(0);

    return error ? (
        props.errorComponent
    ) : (
        <div className="pdf-viewer-container">
            <div
                className="pdf-viewer"
                ref={containerRef}
                style={{ width: `${containerWidth}px` }}
            >
                <div className="pdf-controls-container">
                    <div className="view-control" onClick={increaseZoom}>
                        <i className="zoom-in" />
                    </div>
                    <div className="view-control" onClick={resetZoom}>
                        <i className="zoom-reset" />
                    </div>
                    <div className="view-control" onClick={reduceZoom}>
                        <i className="zoom-out" />
                    </div>
                </div>
                {pdf ? (
                    <Document
                        onError={(e) => setError(e.message)}
                        onLoadProgress={progressCallback}
                        file={`data:application/pdf;base64,${pdf}`}
                    >
                        <Page pageNumber={1} />
                    </Document>
                ) : loading ? (
                    <div className="pdf-loading">Loading ({percent}%)</div>
                ) : null}
            </div>
        </div>
    );
};
