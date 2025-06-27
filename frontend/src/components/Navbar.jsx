import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/">Home</Link>
        <Link to="/startup">Startup</Link>
        <Link to="/investor">Investor</Link>
      </div>
    </nav>
  );
}
