import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const location = useLocation();

    return (
        <nav>
                        <img className="iconPro2" width="200" height="200"
                    src="https://www.iconarchive.com/download/i86695/johanchalibert/mac-osx-yosemite/messages.1024.png" alt="Logo" />
            <h2 className='intHeaders'>N social media app</h2>
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
