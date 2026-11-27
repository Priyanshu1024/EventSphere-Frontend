import { useEffect, useMemo, useState } from "react";
import { setEntry, setFormat } from "@/store/slice/filterSlice";
import { Search, MapPin, Calendar, RotateCcw, Tag, ChevronDown, ChevronRight, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEventFilters } from "@/hooks/useEventFIlters";
import api from "@/lib/axios";
import { useDebounce } from "@/hooks/useDebounce";

const ALLOWED_FORMATS = ["", "in-person", "online", "hybrid"];
const CITIES = [
  "All",
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Pune",
  "Hyderabad",
  "Jaipur",
  "Goa",
  "Kolkata",
  "Ahmedabad",
  "Chennai",
  "Chandigarh",
];

export default function EventFilterBar() {
  const dispatch = useDispatch()
  const { updateParams, searchParams, filters } = useEventFilters();
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [searchVal , setSearchVal] = useState(filters.search)
  const debouncedValue = useDebounce(searchVal, 350);
  const activeFormat = ALLOWED_FORMATS.includes(filters.format) ? filters.format : "";
  const activeCategory = filters.category;
  

  const totalCategories = useMemo(() => {
    return categories.reduce((acc, currentVal) => {
      return acc + (Number(currentVal.eventCount) || 0);
    }, 0);
  }, [categories]);

  //  Debouncing and Throttling done check in useDebouncing and useThrottling hooks

  const activeEntry = filters.isPaid;
  // URL → Redux sync (runs on mount and whenever URL changes)
  // useEffect(() => {
  //   const raw = searchParams.get("format") ?? "";
  //   const safeFormat = ALLOWED_FORMATS.includes(raw) ? raw : "";
  //   if (safeFormat !== activeFormat) {
  //     dispatch(setFormat(safeFormat));
  //   }
  // }, [searchParams, activeFormat, dispatch]);

  // Redux → URL sync (on click), preserving other params
  const handleFormatClick = (f) => {
    updateParams({ format: f });
  };

  function handleSearch(e){
    e.preventDefault()
    updateParams({search : searchVal.trim()});
  }

  function clearSearch(e){
    e.preventDefault();
    setSearchVal("")
    updateParams({search : ""})
  }
  function handleChangeCity(city){
    updateParams({city : city === "All" ? "" : city })
  }

  async function fetchCategories() {
    setIsCategoriesLoading(true);
    try {
      let { data } = await api.get("/api/categories");
      setCategories(data);
    } catch (error) { }
    setIsCategoriesLoading(false);
  }

  useEffect(() => {
    fetchCategories();

  }, [])

  useEffect(() => {
     const trimmedValue = debouncedValue.trim();
    if (trimmedValue !== filters.search) {
      updateParams({ search: trimmedValue });
    }
  }, [debouncedValue])


  const handleEntry = (entry) => {
    updateParams({ isPaid: entry === "" ? "" : String(entry) });
  };

   const isDebouncing = searchVal.trim() !== filters.search.trim();


  return (
    <div className="space-y-4">
      {/* Top Search & Primary Filters Row */}
      <div className="bg-white rounded-2xl border border-[#EBE8DF] p-3 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 text-xs w-4 h-4" />
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value)
              }}
              name="search"
              placeholder="Search by topic, category, artist, city, or venue..."
              className={`w-full pl-9 py-2 text-sm rounded-xl bg-[#FAF9F5] border border-[#DDD9CE] focus:bg-white focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 text-[#111] placeholder-stone-400 outline-none transition-all ${isDebouncing ? "pr-15" : "pr-9"}`}
            />
          </form>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isDebouncing && (
              <span className="w-3.5 h-3.5 border-2 border-stone-300 border-t-[#E65100] rounded-full animate-spin" />
            )}

            {searchVal && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="text-stone-400 hover:text-stone-700 transition-colors p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* City Filter */}
        <div className="relative min-w-37.5">
          <MapPin className="text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none w-3.5 h-3.5" />
          <select
            name="city"
            onChange={(e) => handleChangeCity(e.target.value)}
            className="w-full pl-8 pr-7 py-2 text-xs font-medium rounded-xl bg-[#FAF9F5] border border-[#DDD9CE] focus:border-[#E65100] outline-none text-stone-800 appearance-none cursor-pointer"
          >
           
            {
              CITIES.map((city , i) => {
               return <option  key={i} value={city}>{city === "All" ? "All Locations" : city}</option>
              })
            }
            
          </select>
          <ChevronDown className="text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-3.5 h-3.5" />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer select-none bg-[#FAF9F5] border-[#DDD9CE] text-stone-700 hover:bg-stone-100"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Filter by Date</span>
            <ChevronDown className="text-stone-400 w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="relative min-w-35">
          <select
            name="sort"
            className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-[#FAF9F5] border border-[#DDD9CE] focus:border-[#E65100] outline-none text-stone-800 appearance-none cursor-pointer"
          >
            <option value="startDate_asc">Earliest First</option>
            <option value="startDate_desc">Latest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Title: A – Z</option>
          </select>
          <ChevronDown className="text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-3.5 h-3.5" />
        </div>

        {/* Reset Filters CTA */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Suggestions Banner */}
      <div className="bg-orange-50/80 border border-orange-200/80 rounded-xl p-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs text-orange-950 font-medium flex-wrap">
          <span className="text-[#E65100] font-bold inline-flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Category match:
          </span>
          <span>Looking for events in these categories?</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-600 hover:text-white border border-orange-200 text-xs font-semibold text-[#E65100] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Technology & AI</span>
            <span className="text-[10px] opacity-75 font-mono">(14 events)</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Categories horizontal pill bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => updateParams({ category: "" })}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${activeCategory === ""
            ? "bg-stone-800 text-white border-stone-800"
            : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
            }`}
        >
          <span>All Categories</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-stone-200 text-stone-700">
            {totalCategories}
          </span>
        </button>

        {
          !isCategoriesLoading ? (
            categories.map((c) => {
              const isActive = activeCategory === c.name;
              return (
                <button
                  key={c.id || c._id}
                  type="button"
                  onClick={() => updateParams({ category: c.name })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 border ${isActive
                    ? "bg-stone-800 text-white border-stone-800"
                    : "bg-white border-[#E2DFD4] text-stone-600 hover:bg-stone-100"
                    }`}
                >
                  <span>{c.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-stone-100 text-stone-500"
                      }`}
                  >
                    {c.eventCount || 0}
                  </span>
                </button>
              );
            })
          ) : (
            // skeleton pills while loading
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-7 w-28 rounded-full bg-stone-200 animate-pulse shrink-0"
              />
            ))
          )
        }




      </div>

      {/* Format & Pricing Pills */}
      <div className="flex items-center justify-between text-xs text-stone-500 flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-stone-700">Format:</span>
          {ALLOWED_FORMATS.map((f, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleFormatClick(f)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium capitalize transition-all cursor-pointer ${activeFormat === f
                ? "bg-stone-800 text-white border-stone-800"
                : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
                }`}
            >
              {f === "" ? "All Formats" : f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-700">Entry:</span>
          <button
            type="button"
            onClick={() => handleEntry("")}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${filters.isPaid === ""
              ? "bg-stone-800 text-white border-stone-800"
              : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
              }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => handleEntry(false)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${filters.isPaid === false
              ? "bg-emerald-700 text-white border-emerald-700"
              : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
              }`}
          >
            Free
          </button>

          <button
            type="button"
            onClick={() => handleEntry(true)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${filters.isPaid === true
              ? "bg-stone-800 text-white border-stone-800"
              : "bg-white border-[#DDD9CE] text-stone-600 hover:bg-stone-50"
              }`}
          >
            Paid
          </button>
        </div>
      </div>
    </div>
  );
}