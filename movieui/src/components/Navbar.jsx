import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="logo">🎬 CineBase</span>
      <NavLink to="/"       className={({ isActive }) => isActive ? 'active' : ''}>Movies</NavLink>
      <NavLink to="/actors" className={({ isActive }) => isActive ? 'active' : ''}>Actors</NavLink>
    </nav>
  );
}
