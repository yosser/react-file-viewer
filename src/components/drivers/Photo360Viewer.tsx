// Copyright (c) 2017 PlanGrid, Inc.

import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import "../../styles/photo360.scss";

type TSaved = {
    savedX: number;
    savedY: number;
    savedLongitude: number;
    savedLatitude: number;
};

interface IPhoto360ViewerProps {
    texture: THREE.Texture;
    originalHeight: number;
    originalWidth: number;
}

export const Photo360Viewer: React.FunctionComponent<IPhoto360ViewerProps> = (
    props
) => {
    const loaded = useRef<boolean>(false);
    const photo360 = useRef<HTMLDivElement>(null);
    const [longitude, setLongitude] = useState<number>(0);
    const [latitude, setLatitude] = useState<number>(0);
    const [manualControl, setManualControl] = useState<boolean>(false);
    const [saved, setSaved] = useState<TSaved>({
        savedX: 0,
        savedY: 0,
        savedLongitude: 0,
        savedLatitude: 0,
    });
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
    const [scene, setScene] = useState<THREE.Scene>();
    const [camera, setCamera] = useState<THREE.PerspectiveCamera>();

    useEffect(() => {
        const prepareView = () => {
            const container = photo360.current;
            if (container) {
                if (container.childNodes.length > 0) {
                    container.removeChild(container.childNodes[0]);
                }
                const { width, height } = container.getBoundingClientRect();

                // add rendered
                const localRenderer = new THREE.WebGLRenderer();
                localRenderer.setSize(width, height);
                setRenderer(localRenderer);

                container.appendChild(localRenderer.domElement);
            }

            // creating a new scene
            const localScene = new THREE.Scene();
            setScene(localScene);
            // adding a camera
            const localCamera = new THREE.PerspectiveCamera(
                75,
                props.originalWidth / props.originalHeight,
                1,
                1000
            );
            localCamera.lookAt(new THREE.Vector3(0, 0, 0));
            setCamera(localCamera);

            // creation of a big sphere geometry
            const sphere = new THREE.SphereGeometry(100, 100, 40);
            sphere.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));

            // creation of the sphere material
            const sphereMaterial = new THREE.MeshBasicMaterial();
            sphereMaterial.map = props.texture;
            const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
            localScene.add(sphereMesh);
        };
        if (!loaded.current) {
            loaded.current = true;
            prepareView();
        }
    }, [props.texture]);

    useEffect(() => {
        updateView();
    }, [scene, camera, renderer]);

    const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
        if (manualControl) {
            setLongitude(
                (saved.savedX - event.clientX) * 0.1 + saved.savedLongitude
            );
            setLatitude(
                (event.clientY - saved.savedY) * 0.1 + saved.savedLatitude
            );
            updateView();
        }
    };

    const onMouseUp = () => {
        setManualControl(false);
    };
    const onMouseLeave = () => {
        setManualControl(false);
    };

    const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        setSaved({
            savedLongitude: longitude,
            savedLatitude: latitude,
            savedX: event.clientX,
            savedY: event.clientY,
        });
        setManualControl(true);
    };

    const updateView = () => {
        const localLatitude = Math.max(-85, Math.min(85, latitude));

        // moving the camera according to current latitude (vertical movement)
        // and longitude (horizontal movement)
        const vector = new THREE.Vector3();

        vector.x =
            500 *
            Math.sin(THREE.MathUtils.degToRad(90 - localLatitude)) *
            Math.cos(THREE.MathUtils.degToRad(longitude));
        vector.y = 500 * Math.cos(THREE.MathUtils.degToRad(90 - localLatitude));
        vector.z =
            500 *
            Math.sin(THREE.MathUtils.degToRad(90 - localLatitude)) *
            Math.sin(THREE.MathUtils.degToRad(longitude));
        if (camera) {
            camera.lookAt(vector);
        }
        if (scene && renderer && camera) {
            renderer.render(scene, camera);
        }
    };

    return (
        <div
            ref={photo360}
            className="photo360"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
        />
    );
};
