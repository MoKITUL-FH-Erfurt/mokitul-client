import { useState, useEffect } from "react";

const useMediaQuery = (query: string) => {
  // Initialize state with the result of matchMedia
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);

    // Add the listener
    media.addEventListener("change", listener);

    // Clean up the listener on unmount
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

export default useMediaQuery;
