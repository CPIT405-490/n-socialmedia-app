import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import './NavBar.css';


const NavBar = () => {

    const user = auth.currentUser;

    return (
        <nav>
             <img className="iconPro2" width="200" height="200"
                    src="https://www.iconarchive.com/download/i86695/johanchalibert/mac-osx-yosemite/messages.1024.png" alt="Logo" />
            <h2 className='intHeaders'>N social media app</h2>
            <div className="links">

            {user && (
                    <>
                        <Link to={`/Home/${user.uid}`}>Home</Link>
                        <Link to={`/Profile/${user.uid}`}>Profile</Link>
                    </>
                )}
                
                <Link to="/"><span className='logout'>Log out</span></Link>
            </div>
        </nav>
    );
}

export default NavBar;