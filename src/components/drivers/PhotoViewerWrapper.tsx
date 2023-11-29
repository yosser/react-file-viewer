// Copyright (c) 2017 PlanGrid, Inc.

import React, { useEffect, useState } from "react";

import * as THREE from "three";
import { PhotoViewer } from "./PhotoViewer";
import { Photo360Viewer } from "./Photo360Viewer";
import { Loading } from "../Loading";

export interface IPhotoViewerWrapperProps {
    fileType: string;
    filePath: string;
    errorComponent?: React.ReactElement;
}

export const PhotoViewerWrapper: React.FunctionComponent<IPhotoViewerWrapperProps> =
    (props) => {
        const [originalWidth, setOriginalWidth] = useState<number>(0);
        const [originalHeight, setOriginalHeight] = useState<number>(0);
        const [imageLoaded, setImageLoaded] = useState<boolean>(false);
        const [texture, setTexture] = useState<THREE.Texture>();
        const [error, setError] = useState("");

        useEffect(() => {
            const loader = new THREE.TextureLoader();
            loader.crossOrigin = "";
            // load a resource
            loader.load(
                props.filePath,
                (texture) => {
                    setOriginalWidth(texture.image.width);
                    setOriginalHeight(texture.image.height);
                    setImageLoaded(true);
                    setTexture(texture);
                },
                (xhr) => {
                    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
                },
                (xhr) => {
                    console.log("An error happened", xhr);
                    setError("An error happened");
                }
            );
        }, [props.filePath]);

        const use360 =
            props.fileType === "jpg" &&
            window.Math.abs(originalWidth / originalHeight - 2) <= 0.01;

        return error ? (
            props.errorComponent
        ) : (
            <>
                {!imageLoaded ? (
                    <Loading />
                ) : use360 ? (
                    texture ? (
                        <Photo360Viewer
                            {...props}
                            texture={texture}
                            originalHeight={originalHeight}
                            originalWidth={originalWidth}
                        />
                    ) : null
                ) : texture ? (
                    <PhotoViewer
                        {...props}
                        texture={texture}
                        imageHeight={texture.image.height}
                        imageWidth={texture.image.width}
                    />
                ) : null}
            </>
        );
    };
