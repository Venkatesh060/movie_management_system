import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ActorsPage from './pages/ActorsPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"              element={<MoviesPage />} />
        <Route path="/movies/:id"   element={<MovieDetailPage />} />
        <Route path="/actors"       element={<ActorsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
