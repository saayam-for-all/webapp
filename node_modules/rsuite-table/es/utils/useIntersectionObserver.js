'use client';
import { useState, useEffect } from 'react';

/**
 * useIntersectionObserver Hook
 *
 * @param ref - Ref object of the element to be observed
 */
var useIntersectionObserver = function useIntersectionObserver(ref) {
  var _useState = useState(false),
    isVisible = _useState[0],
    setIsVisible = _useState[1];
  useEffect(function () {
    // Check if the browser supports IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // If not supported, optionally set to visible or handle fallback logic
      setIsVisible(true); // Fallback: Set to visible
      return;
    }

    // Create an IntersectionObserver instance
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        setIsVisible(entry.isIntersecting);
      });
    });
    var element = ref === null || ref === void 0 ? void 0 : ref.current;

    // Start observing the target element
    if (element) {
      observer.observe(element);
    }

    // Cleanup function to unobserve the element when the component unmounts or dependencies change
    return function () {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref]);
  return isVisible;
};
export default useIntersectionObserver;