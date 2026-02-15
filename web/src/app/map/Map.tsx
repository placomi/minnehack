"use client";

import {
  APIProvider,
  ControlPosition,
  Map,
  MapCameraChangedEvent,
  MapMouseEvent,
  useMap,
} from "@vis.gl/react-google-maps";

import { v4 as uuidv4 } from 'uuid';

import { useMemo, useEffect } from "react";
import { DeckProps, PickingInfo } from "@deck.gl/core";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { SnippetT } from "@/types/Snippet";
import { useClickedSnippets } from "@/context/ClickedContext";

function DeckGLOverlay(props: DeckProps) {
  const map = useMap();
  const overlay = useMemo(() => new GoogleMapsOverlay(props), []);

  useEffect(() => {
    overlay.setMap(map);
    return () => overlay.setMap(null);
  }, [map]);

  overlay.setProps(props);
  return null;
}

let snippetArray: SnippetT[];
fetch("/cleantweetfinal.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((array) => {
    snippetArray = array;
  });


function MapEvents() {
  const map = useMap();

  const { setSnippets } = useClickedSnippets();

  useEffect(() => {
    if (!map) return;

    let SIZE = 0.05;

    const listener = map.addListener(
      "click",
      (ev: google.maps.MapMouseEvent) => {
        const bounds = map.getBounds();
        if (!bounds) return;

        const domEvent = ev.domEvent as MouseEvent;
        const mapDiv = map.getDiv();
        const rect = mapDiv.getBoundingClientRect();

        const pixelX = domEvent.clientX - rect.left;
        const pixelY = domEvent.clientY - rect.top;
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const lngPerPixel = (ne.lng() - sw.lng()) / rect.width;
        const latPerPixel = (ne.lat() - sw.lat()) / rect.height;
        const clickLng = sw.lng() + pixelX * lngPerPixel;
        const clickLat = ne.lat() - pixelY * latPerPixel;

        const size = SIZE * rect.width;
        const lowerLong = clickLng - size * lngPerPixel;
        const upperLong = clickLng + size * lngPerPixel;
        const lowerLat = clickLat - size * latPerPixel;
        const upperLat = clickLat + size * latPerPixel;

        let targetSnippets: SnippetT[] = [];
        for (const index in snippetArray) {
          let snippet = snippetArray[index];
          if (
            snippet.longitude >= lowerLong &&
            snippet.longitude <= upperLong &&
            snippet.latitude >= lowerLat &&
            snippet.latitude <= upperLat
          ) {
            // INSERT ID HERE
            const { ...rest } = snippet;
            const pushThis = { ...rest, id: uuidv4() }
            targetSnippets.push(pushThis);
          }
        }
        console.log(targetSnippets);
        setSnippets(targetSnippets);
      },
    );
  }, [map]);
  return null;
}

export default function MapComponent() {
  const layers = [
    new HeatmapLayer<SnippetT>({
      id: "HeatmapLayer",
      data: "/cleantweetfinal.json",
      pickable: true,
      aggregation: "SUM",
      getPosition: (d: SnippetT) => [d.longitude, d.latitude],
      getWeight: (_) => 1, //start with unweighted, every entry gets a 1 weight.
      intensity: 2,
      radiusPixels: 35,
      //colorRange: [
      //  [254, 240, 217],
      //  [253, 212, 158],
      //  [253, 187, 132],
      //  [252, 141, 89],
      //  [227, 74, 51],
      //  [179, 0, 0],
      //],
    }),
  ];

  let zoom = 3;
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <Map
        style={{ width: "100vw", height: "100vh" }}
        mapTypeId="roadmap"
        tilt={0}
        defaultZoom={3}
        defaultCenter={{ lat: 0, lng: 0 }}
        mapId="254180ead19a7cfccf16bb37"
        streetViewControl={false}
        mapTypeControl={false}
        clickableIcons={false}
        fullscreenControlOptions={{ position: ControlPosition.BOTTOM_RIGHT }}
        onCameraChanged={(ev: MapCameraChangedEvent) => {
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom,
          );
          zoom = ev.detail.zoom;
        }}
      >
        <DeckGLOverlay layers={layers} />
      </Map>
      <MapEvents />
    </APIProvider>
  );
}
//
//// Initialize and add the map
//let map: google.maps.Map;
//// Use global types for Deck.gl components
//let heatmapLayer: deck.HeatmapLayer;
//let googleMapsOverlay: deck.GoogleMapsOverlay;
//let marker: google.maps.marker.AdvancedMarkerElement | undefined;
//let infoWindow: google.maps.InfoWindow;
//
//// Declare global namespace for Deck.gl to satisfy TypeScript compiler
//declare namespace deck {
//  class HeatmapLayer {
//    constructor(props: any);
//    props: any;
//    clone(props: any): HeatmapLayer;
//    pickable: boolean; // Added pickable property
//  }
//  class GoogleMapsOverlay {
//    constructor(props: any);
//    setMap(map: google.maps.Map | null): void;
//    setProps(props: any): void;
//  }
//  // Add other Deck.gl types used globally if needed
//}
//
//async function initMap(): Promise<void> {
//  // Progress bar logic moved from index.html
//  var progress,
//    progressDiv = document.querySelector(".mdc-linear-progress");
//  if (progressDiv) {
//    // Assuming 'mdc' is globally available, potentially loaded via a script tag
//    // If not, you might need to import it or add type definitions.
//    // @ts-ignore
//    progress = new mdc.linearProgress.MDCLinearProgress(
//      progressDiv as HTMLElement,
//    );
//    progress.open();
//    progress.determinate = false;
//    progress.done = function () {
//      progress.close();
//      progressDiv?.remove(); // Use optional chaining in case progressDiv is null
//    };
//  }
//
//  // The location for the map center.
//  const position = { lat: 37.77325660358167, lng: -122.41712341793448 }; // Using the center from original deckgl-polygon.js
//
//  //  Request needed libraries.
//  const { Map, InfoWindow } = (await google.maps.importLibrary(
//    "maps",
//  )) as google.maps.MapsLibrary;
//  const { AdvancedMarkerElement } = (await google.maps.importLibrary(
//    "marker",
//  )) as google.maps.MarkerLibrary;
//
//  const mapDiv = document.getElementById("map");
//  if (!mapDiv) {
//    console.error("Map element not found!");
//    return;
//  }
//
//  // The map, centered at the specified position
//  map = new Map(mapDiv, {
//    zoom: 13, // Using the zoom from original deckgl-polygon.js
//    center: position,
//    tilt: 90, // Add tilt
//    heading: -25, // Add heading
//    mapId: "6b73a9fe7e831a00",
//    fullscreenControl: false, // Disable fullscreen control
//    clickableIcons: false, // Disable clicks on base map POIs
//  });
//
//  // Deck.gl Layer and Overlay
//  // Use global deck object
//  heatmapLayer = new deck.HeatmapLayer({
//    // Assign to the outer heatmapLayer
//    id: "HeatmapLayer", // Change layer ID
//    data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json", // Use the loaded data
//    getPosition: (d: any) => d.COORDINATES, // Use 'any' for simplicity, or define a proper type
//    getWeight: (d: any) => d.SPACES, // Use 'any' for simplicity, or define a proper type
//    radiusPixels: 25, // Adjust radius as in user's example
//
//    visible: true,
//    pickable: true,
//    onHover: (info: any) => {
//      // Use 'any' for info for simplicity, or define a proper type
//      const tooltip = document.getElementById("tooltip");
//      if (tooltip) {
//        console.log("Hovered object:", info.object);
//        if (info.object) {
//          // Format data for tooltip (display ADDRESS, RACKS, SPACES)
//          let tooltipContent = "<h4>Bike Parking Info:</h4>"; // Updated title
//          if (info.object.ADDRESS !== undefined) {
//            tooltipContent += `<strong>Address:</strong> ${info.object.ADDRESS}<br>`;
//          }
//          if (info.object.RACKS !== undefined) {
//            tooltipContent += `<strong>Racks:</strong> ${info.object.RACKS}<br>`;
//          }
//          if (info.object.SPACES !== undefined) {
//            tooltipContent += `<strong>Spaces:</strong> ${info.object.SPACES}<br>`;
//          }
//          tooltip.innerHTML = tooltipContent;
//          tooltip.style.left = info.x + "px";
//          tooltip.style.top = info.y + "px";
//          tooltip.style.display = "block";
//        } else {
//          tooltip.style.display = "none";
//        }
//        console.log("Tooltip content set to:", tooltip.innerHTML);
//      }
//    },
//  });
//
//  heatmapLayer.pickable = true; // Ensure pickable is true after creation
//
//  // Use global deck object
//  googleMapsOverlay = new deck.GoogleMapsOverlay({
//    // Assign to the outer googleMapsOverlay
//    layers: [heatmapLayer],
//    controller: true, // Enable Deck.gl to control map view
//  });
//
//  googleMapsOverlay.setMap(map);
//
//  // Hide progress bar after data is loaded and layer is added
//  if (progress) {
//    // Check if progress is defined
//    // Add a small delay to ensure the progress bar is removed
//    setTimeout(() => {
//      // @ts-ignore
//      progress.done(); // hides progress bar
//    }, 100); // 100ms delay
//  }
//
//  // Create a single InfoWindow instance
//  infoWindow = new InfoWindow();
//
//  // Add click listener to the map
//  map.addListener("click", async (event: google.maps.MapMouseEvent) => {
//    const latLng = event.latLng;
//    if (!latLng) return; // Ensure latLng is not null
//
//    if (!marker) {
//      // Create the marker on the first click
//      marker = new AdvancedMarkerElement({
//        map: map,
//        position: latLng,
//        gmpClickable: true,
//      });
//
//      // Add click listener to the marker
//      marker.addListener("click", () => {
//        infoWindow.close();
//        const content = `
//            <div>Location: ${latLng.lat().toFixed(3)}, ${latLng.lng().toFixed(3)}</div>
//            <div><a href="https://www.google.com/maps/search/?api=1&query=${latLng.lat()},${latLng.lng()}" target="_blank">Open in Google Maps</a></div>
//          `;
//        infoWindow.setContent(content);
//        infoWindow.open(map, marker);
//      });
//
//      // Open InfoWindow immediately on first click
//      const content = `
//          <div>Location: ${latLng.lat().toFixed(3)}, ${latLng.lng().toFixed(3)}</div>
//          <div><a href="https://www.google.com/maps/search/?api=1&query=${latLng.lat()},${latLng.lng()}" target="_blank">Open in Google Maps</a></div>
//        `;
//      infoWindow.setContent(content);
//      infoWindow.open(map, marker);
//    } else {
//      // Move the existing marker on subsequent clicks
//      marker.position = latLng;
//      // InfoWindow remains open
//      const content = `
//          <div>Location: ${latLng.lat().toFixed(3)}, ${latLng.lng().toFixed(3)}</div>
//          <div><a href="https://www.google.com/maps/search/?api=1&query=${latLng.lat()},${latLng.lng()}" target="_blank">Open in Google Maps</a></div>
//        `;
//      infoWindow.setContent(content);
//      infoWindow.open(map, marker);
//    }
//  });
//
//  // Button functionality
//  const toggleButton = document.getElementById("toggleButton");
//  if (toggleButton) {
//    // Check if toggleButton is found
//    toggleButton.addEventListener("click", () => {
//      const currentVisible = heatmapLayer.props.visible;
//      // Create a new layer instance with toggled visibility and update the overlay
//      const newLayer = heatmapLayer.clone({ visible: !currentVisible });
//      googleMapsOverlay.setProps({
//        layers: [newLayer],
//      });
//      heatmapLayer = newLayer; // Update the heatmapLayer variable
//
//      toggleButton.textContent = !currentVisible
//        ? "Hide Heatmap Layer"
//        : "Show Heatmap Layer";
//    });
//  }
//}
//
//function mapInit() {
//	useEffect(() => {
//		initMap();
//	}, []);
//}
//export { mapInit };
