# 🎬 Story Flix

A modern, feature-rich entertainment discovery platform built with React. Browse trending content, discover movies & TV series, search with advanced filters, and manage your personal watchlist.

![React](https://img.shields.io/badge/React-17.0.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-5.8-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![TMDB](https://img.shields.io/badge/TMDB-API-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)

---

## ✨ Features

### 📱 Core Pages
- **Trending** - Discover what's popular today with real-time trending content
- **Movies** - Browse and filter an extensive movie catalog
- **TV Series** - Explore TV shows with genre filtering
- **Search** - Find any movie or TV show with advanced search capabilities
- **Watchlist** - Save content to watch later (persisted locally)

### 🎨 Modern UI/UX
- **Multiple Color Themes** - Netflix, Ocean, Purple, Forest, and Sunset themes
- **Light/Dark/System Modes** - Automatic system preference detection
- **Skeleton Loading** - Smooth loading animations for better UX
- **Responsive Design** - Works beautifully on all devices
- **Glassmorphism Effects** - Modern visual design language

### 🔍 Advanced Filtering
- **Sort Options** - By popularity, rating, or release date
- **Year Range Filter** - Filter content by release year
- **Rating Filter** - Set minimum rating threshold
- **Genre Tags** - Filter by multiple genres
- **Language Filter** - Search in specific languages

### 📋 Content Details
- **Cast Carousel** - Browse cast members with smooth carousel
- **Trailer Playback** - Watch trailers via YouTube integration
- **Add to Watchlist** - Quick add/remove from watchlist
- **Detailed Info** - Full synopsis, ratings, and metadata

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 17** | Frontend framework |
| **Material-UI v5** | UI component library |
| **Axios** | HTTP client for API calls |
| **React Router v5** | Client-side routing |
| **TMDB API** | Movie & TV data source |
| **React Alice Carousel** | Cast member carousel |
| **Context API** | State management (Theme & User) |
| **LocalStorage** | Persist watchlist & theme preferences |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dinesh123527/entertainment-hub.git
   cd entertainment-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_KEY=your_tmdb_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header/          # App header with logo & theme toggle
│   ├── MainNav/         # Bottom navigation bar
│   ├── SingleContent/   # Content card component
│   ├── ContentModal/    # Detailed content modal with trailer
│   ├── Carousel/        # Cast member carousel
│   ├── FilterSort/      # Filter & sort controls
│   ├── AdvancedFilters/ # Advanced search filters
│   ├── SkeletonCard/    # Loading skeleton components
│   ├── ThemeSelector/   # Color theme picker
│   ├── ThemeToggle/     # Light/Dark mode toggle
│   └── Pagination/      # Page navigation
├── Pages/
│   ├── Trending/        # Trending content page
│   ├── Movies/          # Movies catalog page
│   ├── Series/          # TV series page
│   ├── Search/          # Search page with filters
│   └── Watchlist/       # User's saved content
├── context/
│   ├── ThemeContext.js  # Theme state management
│   └── UserContext.js   # User preferences & watchlist
├── config/
│   └── config.js        # Image URLs and constants
└── hooks/
    └── useGenre.js      # Genre helper hook
```

---

## 🎨 Available Themes

| Theme | Primary Color | Description |
|-------|---------------|-------------|
| 🎬 Netflix | `#E50914` | Classic red theme |
| 🌊 Ocean | `#00D4FF` | Cool blue tones |
| 🍇 Purple | `#9B59B6` | Elegant purple |
| 🌲 Forest | `#2ECC71` | Nature-inspired green |
| 🌅 Sunset | `#FF6348` | Warm orange tones |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run development server |
| `npm run build` | Build for production |
| `npm test` | Run test suite |
| `npm run eject` | Eject from CRA |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Credits

- **TMDB** - For providing the movie and TV data API
- **Material-UI** - For the beautiful component library
- **React** - For making frontend development a joy

---

<div align="center">
  <p>Made with ❤️ using React</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
