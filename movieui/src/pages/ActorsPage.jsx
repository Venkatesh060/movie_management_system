import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMovies, getActorsByMovie, addActor, deleteActor } from '../services/api';
import Toast from '../components/Toast';

export default function ActorsPage() {
  const [movies,     setMovies]     = useState([]);
  const [actors,     setActors]     = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [loading,    setLoading]    = useState(false);
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState({ name: '', dob: '' });
  const [toast,      setToast]      = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllMovies().then(r => setMovies(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedMovie) { setActors([]); return; }
    setLoading(true);
    getActorsByMovie(selectedMovie)
      .then(r => setActors(r.data))
      .catch(() => showToast('Failed to load actors', 'error'))
      .finally(() => setLoading(false));
  }, [selectedMovie]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addActor({ ...form, movie: { id: parseInt(selectedMovie) } });
      setShowForm(false);
      setForm({ name: '', dob: '' });
      showToast('Actor added');
      getActorsByMovie(selectedMovie).then(r => setActors(r.data));
    } catch {
      showToast('Failed to add actor', 'error');
    }
  };

  const handleDelete = async (actorId) => {
    if (!window.confirm('Remove this actor?')) return;
    try {
      await deleteActor(actorId);
      showToast('Actor removed');
      setActors(a => a.filter(x => x.actorId !== actorId));
    } catch {
      showToast('Failed to remove actor', 'error');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Actors</h1>
        {selectedMovie && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Actor</button>
        )}
      </div>

      {/* Movie selector */}
      <div className="search-bar" style={{ marginBottom: '2rem' }}>
        <select
          style={{ flex: 1 }}
          value={selectedMovie}
          onChange={e => setSelectedMovie(e.target.value)}
        >
          <option value="">— Select a movie to view its cast —</option>
          {movies.map(m => <option key={m.id} value={m.id}>{m.movieName}</option>)}
        </select>
      </div>

      {/* Actors list */}
      {!selectedMovie ? (
        <div className="empty">
          <div className="icon">🎭</div>
          <p>Select a movie above to see its cast</p>
        </div>
      ) : loading ? (
        <div className="loading">LOADING...</div>
      ) : actors.length === 0 ? (
        <div className="empty">
          <div className="icon">👤</div>
          <p>No actors added for this movie yet</p>
        </div>
      ) : (
        <div className="grid">
          {actors.map(actor => (
            <div key={actor.actorId} className="movie-card">
              <div className="poster" style={{ fontSize: '2.5rem', height: '100px' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--accent)', color: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Bebas Neue', fontSize: '2rem'
                }}>
                  {actor.name.charAt(0)}
                </div>
              </div>
              <div className="card-body">
                <h3>{actor.name}</h3>
                {actor.dob && (
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
                    📅 {actor.dob}
                  </div>
                )}
                <div className="card-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate(`/movies/${selectedMovie}`)}
                  >View Movie</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(actor.actorId)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Actor Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <h2>ADD ACTOR</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Name *</label>
                <input required placeholder="e.g. Ram Charan"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" value={form.dob}
                  onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Actor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
