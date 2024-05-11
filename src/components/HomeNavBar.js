import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import './NavBar.css';


const HomeNavBar  = () => {

    const user = auth.currentUser;

    return (
        <nav>

            <h2 className='intHeaders'>Roar app</h2>
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

export default HomeNavBar ;