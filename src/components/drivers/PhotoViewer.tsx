// Copyright (c) 2017 PlanGrid, Inc.

import React, { useEffect, useRef } from "react";

import "../../styles/photo-viewer.scss";

interface IPhotoViewerProps {
    filePath: string;
    texture: THREE.Texture;
    imageHeight: number;
    imageWidth: number;
}

export const PhotoViewer: React.FunctionComponent<IPhotoViewerProps> = ({
    filePath,
    texture,
    imageHeight,
    imageWidth,
}) => {
    const photoContainer = useRef<HTMLDivElement>(null);
    const loaded = useRef<boolean>(false);
    useEffect(() => {
        const prepareImage = () => {
            const container = photoContainer.current;
            if (container) {
                if (container.childNodes.length > 0) {
                    container.removeChild(container.childNodes[0]);
                }
                const { width, height } = container.getBoundingClientRect();
                container.appendChild(texture.image);

                const imageDimensions = getImageDimensions(width, height);
                texture.image.style.width = `${imageDimensions.width}px`;
                texture.image.style.height = `${imageDimensions.height}px`;
                texture.image.setAttribute("class", "photo");
            }
        };
        if (!loaded.current) {
            loaded.current = true;
            prepareImage();
        }
    }, [filePath]);

    const getImageDimensions = (viewerWidth: number, viewerHeight: number) => {
        // Scale image to fit into viewer
        let imgHeight;
        let imgWidth;

        if (imageHeight <= viewerHeight && imageWidth <= viewerWidth) {
            imgWidth = imageWidth;
            imgHeight = imageHeight;
        } else {
            const heightRatio = viewerHeight / imageHeight;
            const widthRatio = viewerWidth / imageWidth;
            if (heightRatio < widthRatio) {
                imgHeight = imageHeight * heightRatio;
                imgWidth = imageWidth * heightRatio;
            } else {
                imgHeight = imageHeight * widthRatio;
                imgWidth = imageWidth * widthRatio;
            }
        }

        return { height: imgHeight, width: imgWidth };
    };

    return <div ref={photoContainer} className="photo-viewer-container" />;
};
