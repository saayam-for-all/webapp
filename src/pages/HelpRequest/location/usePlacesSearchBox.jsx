import { useRef, useState, useCallback } from "react";

const usePlacesSearchBox = (setLocation) => {
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimer = useRef(null);

  const handleSearchChange = useCallback(async (value) => {
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    // wait 500ms before calling API to avoid rate limiting
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

  const handleSelectSuggestion = (displayName) => {
    setLocation(displayName);
    setSuggestions([]);
  };

  return { inputRef, suggestions, handleSearchChange, handleSelectSuggestion };
};

export default usePlacesSearchBox;
