import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getMovieById, getActorsByMovie, updateMovie,
  addActor, deleteActor,
  getReviewsByMovie, addReview, deleteReview
} from '../services/api';
import MovieForm from '../components/MovieForm';
import Toast from '../components/Toast';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie,     setMovie]     = useState(null);
  const [actors,    setActors]    = useState([]);
  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('cast');

  const [showEdit,  setShowEdit]  = useState(false);
  const [showActor, setShowActor] = useState(false);
  const [actorForm, setActorForm] = useState({ name: '', dob: '' });

  const [reviewText,   setReviewText]   = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewUserId, setReviewUserId] = useState('');
  const [hoverStar,    setHoverStar]    = useState(0);
  const [submitting,   setSubmitting]   = useState(false);
  const [toast,        setToast]        = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const loadAll = async () => {
    try {
      const [mRes, aRes, rRes] = await Promise.all([
        getMovieById(id),
        getActorsByMovie(id),
        getReviewsByMovie(id)
      ]);
      setMovie(mRes.data);
      setActors(aRes.data);
      setReviews(rRes.data);
    } catch {
      showToast('Failed to load movie', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, [id]);

  const handleUpdate = async (data) => {
    try {
      await updateMovie(id, data);
      setShowEdit(false);
      showToast('Movie updated');
      loadAll();
    } catch {
      showToast('Failed to update', 'error');
    }
  };

  const handleAddActor = async (e) => {
    e.preventDefault();
    try {
      await addActor({ ...actorForm, movie: { id: parseInt(id) } });
      setShowActor(false);
      setActorForm({ name: '', dob: '' });
      showToast('Actor added');
      loadAll();
    } catch {
      showToast('Failed to add actor', 'error');
    }
  };

  const handleDeleteActor = async (actorId) => {
    if (!window.confirm('Remove this actor?')) return;
    try {
      await deleteActor(actorId);
      showToast('Actor removed');
      loadAll();
    } catch {
      showToast('Failed to remove actor', 'error');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) { showToast('Please select a star rating', 'error'); return; }
    if (!reviewUserId) { showToast('Please enter your User ID', 'error'); return; }
    setSubmitting(true);
    try {
      await addReview({
        userId:  parseInt(reviewUserId),
        movieId: parseInt(id),
        review:  reviewText,
        rating:  reviewRating
      });
      setReviewText('');
      setReviewRating(0);
      setReviewUserId('');
      showToast('Review added!');
      loadAll();
    } catch (err) {
      showToast(err.response?.data || 'Failed to add review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const uid = prompt('Enter your User ID to confirm deletion:');
    if (!uid) return;
    try {
      await deleteReview(reviewId, parseInt(uid));
      showToast('Review deleted');
      loadAll();
    } catch {
      showToast('Not authorised to delete this review', 'error');
    }
  };

  const stars     = (r) => !r ? '—' : '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r)) + ` ${Number(r).toFixed(1)}`;
  const formatDate = (dt) => !dt ? '' : new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const initials   = (name) => name ? name.charAt(0).toUpperCase() : '?';

  if (loading) return <div className="loading">LOADING...</div>;
  if (!movie)  return <div className="page"><p>Movie not found.</p></div>;

  return (
    <div className="page">
      <button className="btn btn-ghost" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/')}>
        ← Back
      </button>

      {/* Movie Info */}
      <div className="detail-grid">
        <div className="detail-poster">🎬</div>
        <div className="detail-info">
          <h1>{movie.movieName}</h1>
          <div className="meta">
            {movie.genre    && <span className="badge accent">{movie.genre}</span>}
            {movie.language && <span className="badge">{movie.language}</span>}
            {movie.duration && <span className="badge">{movie.duration} min</span>}
          </div>
          <div className="detail-stat">
            <div><span>Release Date</span><strong>{movie.releaseDate || '—'}</strong></div>
            <div><span>Avg Rating</span><strong style={{ color: 'var(--accent)' }}>{stars(movie.avgRating)}</strong></div>
            <div><span>Reviews</span><strong>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</strong></div>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => setShowEdit(true)}>Edit Movie</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="section-tabs">
        <button className={`section-tab ${activeTab === 'cast'    ? 'active' : ''}`} onClick={() => setActiveTab('cast')}>
          Cast ({actors.length})
        </button>
        <button className={`section-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
          Reviews ({reviews.length})
        </button>
      </div>

      {/* Cast Tab */}
      {activeTab === 'cast' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-ghost" onClick={() => setShowActor(true)}>+ Add Actor</button>
          </div>
          {actors.length === 0 ? (
            <div className="empty" style={{ padding: '2rem' }}>
              <div className="icon">🎭</div><p>No actors added yet</p>
            </div>
          ) : (
            <div className="actor-list">
              {actors.map(actor => (
                <div key={actor.actorId} className="actor-chip">
                  <div className="avatar">{initials(actor.name)}</div>
                  <div>
                    <div className="actor-name">{actor.name}</div>
                    {actor.dob && <div className="actor-dob">{actor.dob}</div>}
                  </div>
                  <button className="btn btn-danger btn-sm" style={{ marginLeft: '0.5rem' }}
                    onClick={() => handleDeleteActor(actor.actorId)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div>
          {/* Write a review */}
          <div className="review-form">
            <h3>Write a Review</h3>
            <form onSubmit={handleAddReview}>
              <div className="form-group">
                <label>Your User ID</label>
                <input type="number" placeholder="Enter your userId e.g. 1"
                  value={reviewUserId} onChange={e => setReviewUserId(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '0.4rem', fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Rating *
              </div>
              <div className="star-picker">
                {[1,2,3,4,5].map(s => (
                  <span key={s}
                    className={s <= (hoverStar || reviewRating) ? 'filled' : ''}
                    onMouseEnter={() => setHoverStar(s)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => setReviewRating(s)}>★</span>
                ))}
                {reviewRating > 0 && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)', alignSelf: 'center', marginLeft: '0.4rem' }}>
                    {reviewRating}/5
                  </span>
                )}
              </div>
              <textarea className="review-textarea"
                placeholder="Share your thoughts about this movie..."
                value={reviewText} onChange={e => setReviewText(e.target.value)} required />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="empty" style={{ padding: '2rem' }}>
              <div className="icon">💬</div>
              <p>No reviews yet — be the first to review!</p>
            </div>
          ) : (
            reviews.map(r => (
              <div key={r.reviewId} className="review-card">
                <div className="review-header">
                  <div className="review-user">
                    <div className="review-avatar">{initials(r.user?.username)}</div>
                    <div>
                      <div className="review-username">{r.user?.username || 'User ' + r.user?.userId}</div>
                      <div className="review-date">{formatDate(r.createdAt)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(r.reviewId)}>
                      Delete
                    </button>
                  </div>
                </div>
                <div className="review-text">{r.review}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Movie Modal */}
      {showEdit && (
        <MovieForm
          movie={{ movieName: movie.movieName || '', duration: movie.duration || '', genre: movie.genre || '',
                   releaseDate: movie.releaseDate || '', language: movie.language || '',
                   posterUrl: movie.posterUrl || '', avgRating: movie.avgRating || '' }}
          onSubmit={handleUpdate} onClose={() => setShowEdit(false)} />
      )}

      {/* Add Actor Modal */}
      {showActor && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowActor(false)}>
          <div className="modal">
            <h2>ADD ACTOR</h2>
            <form onSubmit={handleAddActor}>
              <div className="form-group">
                <label>Name *</label>
                <input required placeholder="e.g. Leonardo DiCaprio"
                  value={actorForm.name} onChange={e => setActorForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" value={actorForm.dob}
                  onChange={e => setActorForm(f => ({ ...f, dob: e.target.value }))} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowActor(false)}>Cancel</button>
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
