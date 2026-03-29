import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMovies, searchMovies, filterMovies, addMovie, deleteMovie } from '../services/api';
import MovieForm from '../components/MovieForm';
import Toast from '../components/Toast';

const genres    = ['', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Animation'];
const languages = ['', 'English', 'Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'];

export default function MoviesPage() {
  const [movies,    setMovies]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [genre,     setGenre]     = useState('');
  const [language,  setLanguage]  = useState('');
  const [minRating, setMinRating] = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [toast,     setToast]     = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (search.trim()) {
        res = await searchMovies(search.trim());
      } else if (genre || language || minRating) {
        const params = {};
        if (genre)     params.genre     = genre;
        if (language)  params.language  = language;
        if (minRating) params.minRating = parseFloat(minRating);
        res = await filterMovies(params);
      } else {
        res = await getAllMovies();
      }
      setMovies(res.data);
    } catch {
      showToast('Failed to load movies', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, genre, language, minRating]);

  useEffect(() => { load(); }, [load]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAdd = async (data) => {
    try {
      await addMovie(data);
      setShowForm(false);
      showToast('Movie added successfully');
      load();
    } catch {
      showToast('Failed to add movie', 'error');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this movie?')) return;
    try {
      await deleteMovie(id);
      showToast('Movie deleted');
      load();
    } catch {
      showToast('Failed to delete movie', 'error');
    }
  };

  const stars = (rating) => {
    if (!rating) return '—';
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating)) + ` ${rating.toFixed(1)}`;
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <h1>All Movies</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Movie</button>
      </div>

      {/* Search & Filter */}
      <div className="search-bar">
        <input
          placeholder="🔍  Search by name..."
          value={search}
          onChange={e => { setSearch(e.target.value); setGenre(''); setLanguage(''); setMinRating(''); }}
        />
        <select value={genre} onChange={e => { setGenre(e.target.value); setSearch(''); }}>
          {genres.map(g => <option key={g} value={g}>{g || 'All Genres'}</option>)}
        </select>
        <select value={language} onChange={e => { setLanguage(e.target.value); setSearch(''); }}>
          {languages.map(l => <option key={l} value={l}>{l || 'All Languages'}</option>)}
        </select>
        <select value={minRating} onChange={e => { setMinRating(e.target.value); setSearch(''); }}>
          <option value="">Any Rating</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
        {(genre || language || minRating || search) && (
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setGenre(''); setLanguage(''); setMinRating(''); }}>
            Clear
          </button>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="loading">LOADING...</div>
      ) : movies.length === 0 ? (
        <div className="empty">
          <div className="icon">🎬</div>
          <p>No movies found</p>
        </div>
      ) : (
        <div className="grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card" onClick={() => navigate(`/movies/${movie.id}`)}>
              <div className="poster">🎬</div>
              <div className="card-body">
                <h3>{movie.movieName}</h3>
                <div className="meta">
                  {movie.genre    && <span className="badge accent">{movie.genre}</span>}
                  {movie.language && <span className="badge">{movie.language}</span>}
                  {movie.duration && <span className="badge">{movie.duration} min</span>}
                </div>
                {movie.releaseDate && (
                  <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    📅 {movie.releaseDate}
                  </div>
                )}
                <div className="rating">{stars(movie.avgRating)}</div>
                <div className="card-actions">
                  <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); navigate(`/movies/${movie.id}`); }}>
                    View
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={e => handleDelete(e, movie.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Movie Modal */}
      {showForm && <MovieForm onSubmit={handleAdd} onClose={() => setShowForm(false)} />}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
