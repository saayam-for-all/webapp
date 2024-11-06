import { useRef } from 'react';
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

const usePlacesSearchBox = () => {
  const inputRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDv7--yEnq84ZN3l03y50O33M4S89Un4U0",
    libraries: ["places"]
  });

  const handleOnPlacesChanged = () => {
    if (inputRef.current) {
      const places = inputRef.current.getPlaces();
      console.log(places); // Handle places or pass it to state
    }
  };

  return { inputRef, isLoaded, handleOnPlacesChanged };
};

export default usePlacesSearchBox;
