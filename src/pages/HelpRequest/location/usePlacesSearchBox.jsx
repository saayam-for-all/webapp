import { useRef, useState, useCallback } from "react";

const usePlacesSearchBox = (setLocation, setCoordinates) => {
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimer = useRef(null);

  const handleSearchChange = useCallback(async (value) => {
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`,
          {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "SaayamForAll/1.0",
            },
          },
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }, 500);
  }, []);

  const handleSelectSuggestion = (suggestion) => {
    console.log("Suggestion coordinates:", {
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
    });
    setLocation(suggestion.display_name);
    if (setCoordinates) {
      setCoordinates({
        latitude: parseFloat(suggestion.lat),
        longitude: parseFloat(suggestion.lon),
      });
    }
    setSuggestions([]);
  };

  return { inputRef, suggestions, handleSearchChange, handleSelectSuggestion };
};

export default usePlacesSearchBox;
