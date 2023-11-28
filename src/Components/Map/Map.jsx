import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import { fromLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import Overlay from "ol/Overlay";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import OverlayPositioning from "ol/OverlayPositioning";
import './Map.css';
import img from "./icon.png";
const EPSG_CODE = 'EPSG:4326';
const KALYANI_COORDINATES = fromLonLat([88.3218228, 22.4813564], EPSG_CODE);
const DEFAULT_ZOOM_LEVEL = 10;

const MyMap = (props) => {
    const { points = [], zoomLevel =14 } = props;
    const [shouldRenderMap, setShouldRenderMap] = useState(true);

    const locations = points.map((point) => {
        const lng = parseFloat(point.lng); // Convert point.lng to number
        const lat = parseFloat(point.lat); // Convert point.lat to number
        return fromLonLat([lng, lat]);
      });
      

    const mapRef = useRef(null);
    const popupRefs = useRef(points.map(() => React.createRef()));
    const closeButtonRefs = useRef(points.map(() => React.createRef()));

    useEffect(() => {
        let map;

        if (shouldRenderMap) {
            const rasterLayer = new TileLayer({ source: new OSM() });
            const vectorLayer = createVectorLayerWithMarkers(points);
            const popups = points.map((point, index) =>
                createPopup(locations[index], popupRefs.current[index], closeButtonRefs.current[index], point.title, point.content)
            );

            map = createMap(
                rasterLayer,
                vectorLayer,
                popups,
                locations[0], 
                zoomLevel,
                mapRef.current
            );
        }

        // Cleanup function
        return () => {
            if (map) {
                map.setTarget(null); // Remove the map from the DOM
            }
        };
    }, [shouldRenderMap, points, zoomLevel]);

    const handleMapRender = () => {
        setShouldRenderMap(!shouldRenderMap);
    };

    return (
        <div>
            <button onClick={handleMapRender}>Render Map</button>
            {shouldRenderMap && (
                <div>
                    <div ref={mapRef} className='my-map'></div>
                    {points.map((point, index) => (
                        <div
  style={{
    backgroundColor: point.content.includes("Danger") ? "#f44336" : "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
  }}
  key={index}
  ref={popupRefs.current[index]}
  className="ol-popup"
>
  <span
    ref={closeButtonRefs.current[index]}
    className="ol-popup-closer"
    style={{
      position: "absolute",
      top: 10,
      right: 10,
      cursor: "pointer",
    }}
  ></span>

  <h4
    style={{
      color: point.content.includes("Danger") ? "#fff" : "#000",
      fontSize: 20,
      marginBottom: 10,
    }}
  >
    {point.title}
  </h4>

  <p style={{ color: point.content.includes("Danger") ? "#fff" : "#000" }}>
    Mode: {point.content}
  </p>
</div>

                    ))}
                </div>
            )}
        </div>
    );
};

function createPopup(
    location,
    popupElementRef,
    closeButtonElementRef,
    title,
    content
) {
    const popup = new Overlay({
        element: popupElementRef.current,
        positioning: OverlayPositioning.BOTTOM_CENTER,
        offset: [0, -50],
        position: location
    });

    registerCloseButtonEvent(closeButtonElementRef.current, popup);
    return popup;
}

function createVectorLayerWithMarkers(points) {
    const features = points.map(point => {
        const location = fromLonLat([point.lng, point.lat]);
        const iconFeature = new Feature({
            geometry: new Point(location),
            name: point.title,
            population: 4000,
            rainfall: 500,
        });

        const iconStyle = new Style({
            image: new Icon({
                anchor: [0.5, 40], // pixel
                anchorXUnits: IconAnchorUnits.FRACTION,
                anchorYUnits: IconAnchorUnits.PIXELS,
                src: img,
            })
        });

        iconFeature.setStyle(iconStyle);
        return iconFeature;
    });

    return new VectorLayer({
        source: new VectorSource({
            features: features
        })
    });
}

function createMap(
    rasterLayer,
    vectorLayer,
    popups,
    location,
    zoomLevel,
    mapElement
) {
    const map = new Map({
        layers: [
            rasterLayer,
            vectorLayer
        ],
        overlays: popups,
        target: mapElement,
        view: new View({
            center: location,
            zoom: zoomLevel
        })
    });

    // Show popup when clicking on marker.
    registerMapEvent(map, popups, location);
    return map;
}

function registerMapEvent(map, popups, location) {
    map.on('singleclick', event => {
        const pixel = map.getEventPixel(event.originalEvent);
        const feature = map.forEachFeatureAtPixel(pixel, feature => feature);
        if (feature) {
            const index = popups.findIndex(popup => popup.getElement() === feature.get('popupElement'));
            if (index !== -1) {
                popups[index].setPosition(location);
            }
        } else {
            popups.forEach(popup => popup.setPosition(undefined));
        }
    });

    // Change mouse cursor when over marker.
    map.on('pointermove', function (e) {
        const pixel = map.getEventPixel(e.originalEvent);
        const hasFeature = map.hasFeatureAtPixel(pixel);
        const element = map.getTarget();
        element.style.cursor = hasFeature ? 'pointer' : 'auto';
    });
}

function registerCloseButtonEvent(closeButtonElement, popup) {
    closeButtonElement.onclick = (e) => {
        e.preventDefault();
        popup.setPosition(undefined);
    };
}

export default MyMap;
