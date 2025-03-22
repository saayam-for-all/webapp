import { useRef } from "react";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";

const usePlacesSearchBox = () => {
  const inputRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLEMAPS_API_KEY,
    libraries: ["places"],
  });

  const getPlaces = () => {
    if (inputRef.current) {
      const places = inputRef.current.getPlaces();
      if (places.length > 0) {
        const place = places[0]; // Get the first suggested place
        return place.formatted_address;
      }
    }
    return "";
  };

  return { inputRef, isLoaded, getPlaces };
};

export default usePlacesSearchBox;
