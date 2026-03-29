import { useState } from 'react';

const empty = {
  movieName: '', duration: '', genre: '',
  releaseDate: '', language: '', posterUrl: '', avgRating: ''
};

const genres    = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Animation'];
const languages = ['English', 'Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'];

export default function MovieForm({ movie, onSubmit, onClose }) {
  const [form, setForm] = useState(movie || empty);

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.duration)  payload.duration  = parseInt(payload.duration);
    if (payload.avgRating) payload.avgRating = parseFloat(payload.avgRating);
    // remove empty strings
    Object.keys(payload).forEach(k => payload[k] === '' && delete payload[k]);
    onSubmit(payload);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{movie ? 'EDIT MOVIE' : 'ADD MOVIE'}</h2>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Movie Name *</label>
            <input name="movieName" value={form.movieName} onChange={change} required placeholder="e.g. Inception" />
          </div>
          <div className="form-group">
            <label>Genre</label>
            <select name="genre" value={form.genre} onChange={change}>
              <option value="">Select genre</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Language</label>
            <select name="language" value={form.language} onChange={change}>
              <option value="">Select language</option>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input name="duration" type="number" value={form.duration} onChange={change} placeholder="e.g. 148" />
          </div>
          <div className="form-group">
            <label>Release Date</label>
            <input name="releaseDate" type="date" value={form.releaseDate} onChange={change} />
          </div>
          <div className="form-group">
            <label>Rating (0–5)</label>
            <input name="avgRating" type="number" step="0.1" min="0" max="5" value={form.avgRating} onChange={change} placeholder="e.g. 4.5" />
          </div>
          <div className="form-group">
            <label>Poster URL</label>
            <input name="posterUrl" value={form.posterUrl} onChange={change} placeholder="https://..." />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{movie ? 'Update' : 'Add Movie'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
