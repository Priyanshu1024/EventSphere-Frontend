import { useSearchParams } from "react-router";

export function useEventFilters() {
    const [searchParams, setSearchParams] = useSearchParams();
    const isPaidParams = searchParams.get("isPaid")
    const filters = {
        format : searchParams.get("format") || "" , 
        isPaid : isPaidParams  === "true" ? true : isPaidParams === "false" ? false : "" ,
        category : searchParams.get("category") || "",
        search : searchParams.get("search") || "",
    }
    function updateParams(updates) {
        const params = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, val]) => {
            if (val !== undefined && val !== "" && val !== null) {
                params.set(key, String(val));
            } else {
                params.delete(key);
            }
        });
        setSearchParams(params);
    }

    function apiQueryString({ page = 1, limit = 12 } = {}) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));   // ← add this line
    if (filters.format) params.set("format", filters.format);
    if (filters.isPaid !== "") params.set("isPaid", String(filters.isPaid));
    if(filters.category) params.set("category" , String(filters.category))
    return params.toString();
}

    return {
        updateParams,
        searchParams,
        filters,
        apiQueryString
    }


}