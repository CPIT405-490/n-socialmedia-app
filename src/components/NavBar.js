import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const location = useLocation();

    return (
        <nav>
            <h2>N social media app</h2>
            <div className="links">
                {location.pathname === '/' ? (
                    <Link to="/signup">Sign Up</Link>
                ) : (
                    <Link to="/">Sign In</Link>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
