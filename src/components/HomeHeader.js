import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import './NavBar.css';


const NavBar = () => {

    const user = auth.currentUser;

    return (
        <nav>
            <h2>N social media app</h2>
            <div className="links">

            {user && (
                    <>
                        <Link to={`/Home/${user.uid}`}>Home</Link>
                        <Link to={`/Profile/${user.uid}`}>Profile</Link>
                    </>
                )}
                
                <Link to="/signup">Sign Up</Link>
            </div>
        </nav>
    );
}

export default NavBar;