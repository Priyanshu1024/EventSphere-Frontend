import Skeleton from '@/Components/common/Skeleton';
import EventCard from '@/Components/Events/EventCard';
import api from '@/lib/axios';
import { formatPrice } from '@/lib/utils';
import { Calendar, MapPin, ParasolIcon, RotateCcw, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useInView } from 'react-intersection-observer'
import EventFilterBar from '@/Components/Events/EventFilterBar';
import { useSelector } from 'react-redux';
import { useEventFilters } from '@/hooks/useEventFIlters';

export default function ExplorePage() {

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, hasMore: false, totalPages: 1, })

  
  const activeRequestId = useRef(0);
  const {filters , apiQueryString} = useEventFilters();
  async function fetchEvents(page = 1, append = false) {
    const thisRequestId = ++activeRequestId.current;
    let str = [`${apiQueryString()}`, `page=${page}`].filter(Boolean).join("&")
    try {
      if (!append) setIsLoading(true);
      


      const { data: events, pagination } = await api.get(
      `/api/events?${str}`
    );
      if (thisRequestId !== activeRequestId.current) {
        return;
      }
      if (append) {
        setEvents((prev) => [...prev, ...events]);
      } else {
        setEvents(events);
      }
      setPagination(pagination);
    } catch (error) {
      console.error(error);
    } finally {
      append ? setIsMoreLoading(false) : setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents(1, false);
  }, [filters.format, filters.isPaid , filters.category, filters.search])

  const { ref: observerRef, inView } = useInView({
    threshold: 0.5
  })

  useEffect(() => {
    if (inView && pagination.hasMore && !isLoading && !isMoreLoading) {
      fetchEvents(pagination.page + 1, true);
    }
  }, [inView, pagination.hasMore, pagination.page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111] tracking-tight">
          Explore Curated Gatherings
        </h1>
        <p className="text-sm text-stone-600">
          Discover summits, masterclasses, acoustic shows, and retreats across India
        </p>
      </div>

      {/* Filter and Search Bar */}
      <EventFilterBar/>

      {/* Results Header with Active Filter Tags */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 pt-2 border-b border-[#EBE8DF] pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <strong className="text-stone-800">{events.length}</strong> events of {pagination.total}
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#C2410C] border border-orange-200">
            <span>📍</span>
            <span>City: Bengaluru</span>
            <button
              type="button"
              className="hover:text-rose-700 ml-0.5 cursor-pointer"
              aria-label="Remove city filter"
            >
              ✕
            </button>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
            <span className="text-[#E65100]">🏷️</span>
            <span>Category: Technology & AI</span>
            <button
              type="button"
              className="hover:text-rose-700 ml-0.5 cursor-pointer"
              aria-label="Remove category filter"
            >
              ✕
            </button>
          </span>
        </div>
      </div>

      {/* Events Grid */}
      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {
            isLoading ? (
              [...Array(12)].map((_, i) => {
                return <Skeleton key={i} />
              })
            ) : events.map((e) => {
              return <EventCard key={e.id || e._id} event={e} />
            })
          }



        </div>

        {/* Bottom indicator */}
        <div
          ref={observerRef}
          className="py-10 min-h-20 flex items-center justify-center text-xs"
        >
          {pagination.page < pagination.totalPages ? (
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="w-4 h-4 border-2 border-[#E65100] border-t-transparent rounded-full animate-spin" />
              <span>Unfolding more community gatherings...</span>
            </div>
          ) : (
            events.length == 0 ? <p className="text-[11px] text-stone-400">
              No Events are there for your preferences
            </p> : <p className="text-[11px] text-stone-400">
              You've Unfolded all the gatherings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}