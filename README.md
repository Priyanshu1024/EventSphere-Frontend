# EventSphere Frontend

India's Curated Community Conclaves Extraordinary gatherings for curious minds.

## Screenshots



### Home page
![Explore page with event cards](./src/assets/Screenshot%202026-11-27%20195307.png)

### Explore page
![Explore page with event cards](./src/assets/Screenshot%202026-11-27%20195425.png)

## About

EventSphere lets users browse curated events, search by topic or venue, and filter by city, category, format, and price. This repo contains the client-side application; it talks to a separate backend API for event and category data.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Redux Toolkit
- Axios
- lucide-react for icons
- react-intersection-observer for infinite scroll

## Features

- Event listing with infinite scroll pagination
- Search across topics, categories, artists, and venues
- City filter
- Category pills with event counts
- Format filter (in-person, online, hybrid)
- Pricing filter (all, free, paid)
- Sort options for date, price, and title
- Debounced search input
- Skeleton loading states
- Responsive layout



### Installation

```bash
git clone https://github.com/Priyanshu1024/EventSphere-Frontend.git
cd EventSphere-Frontend
npm install