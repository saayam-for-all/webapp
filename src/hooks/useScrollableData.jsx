import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getMyRequests,
  getOthersRequests,
  getManagedRequests,
  getAllRequests,
} from "../services/requestServices";

const useScrollableData = (
  userGroups,
  activeTab,
  searchTerm,
  statusFilter,
  categoryFilter,
) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [error, setError] = useState(null);

  // Determine which API to use based on user role and active tab
  const getApiFunction = useCallback(() => {
    // Handle case when userGroups is undefined or null
    if (!userGroups || !Array.isArray(userGroups)) {
      console.warn("User groups not available, defaulting to getMyRequests");
      return getMyRequests;
    }

    const isAdmin =
      userGroups.includes("SystemAdmins") ||
      userGroups.includes("Admins") ||
      userGroups.includes("Stewards");
    const isVolunteer = userGroups.includes("Volunteers");

    if (isAdmin) {
      return getAllRequests; // Admin/Steward sees all requests
    } else if (isVolunteer) {
      if (activeTab === "managedRequests") {
        return getManagedRequests; // Volunteer sees only managed requests
      }
      return getMyRequests; // Fallback for volunteers
    } else {
      // Beneficiary sees only their own requests
      if (activeTab === "myRequests") {
        return getMyRequests;
      }
      return getOthersRequests;
    }
  }, [userGroups, activeTab]);

  // Fetch data function
  const fetchData = useCallback(
    async (page = 1, append = false) => {
      try {
        setIsLoading(true);
        setError(null);

        const apiFunction = getApiFunction();
        const response = await apiFunction(page, 50); // 50 rows per page as requested

        if (append) {
          setData((prevData) => [...prevData, ...(response.body || [])]);
        } else {
          setData(response.body || []);
          setCurrentPage(1);
        }

        setTotalRows(response.totalCount || response.body?.length || 0);
        setHasMore(response.hasMore || response.body?.length === 50);

        if (append) {
          setCurrentPage(page);
        }
      } catch (err) {
        console.error("Error fetching data:", err);

        // Handle specific authentication errors
        if (
          err.message?.includes("AuthUserPoolException") ||
          err.message?.includes("UserPool not configured")
        ) {
          setError(
            "Authentication not configured. Please check your login status.",
          );
        } else if (
          err.message?.includes("401") ||
          err.message?.includes("Unauthorized")
        ) {
          setError("Authentication required. Please log in again.");
        } else {
          setError(err.message || "Failed to fetch data");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [getApiFunction],
  );

  // Load more data
  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await fetchData(currentPage + 1, true);
    }
  }, [fetchData, currentPage, isLoading, hasMore]);

  // Reset and fetch new data when dependencies change
  useEffect(() => {
    setData([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchData(1, false);
  }, [activeTab, userGroups]);

  return {
    data,
    isLoading,
    hasMore,
    totalRows,
    error,
    loadMore,
    refetch: () => fetchData(1, false),
  };
};

export default useScrollableData;
