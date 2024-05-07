import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import Home from './components/Home';
import Profile from './components/Profile';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

import './App.css';

function App() {


  return (
  
      <BrowserRouter>

        <div className="App">
          <Routes>
            
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path='/Home' element={<ProtectedRoute Component={Home}/>}/>
            <Route path='/Profile' element={<ProtectedRoute Component={Profile}/>} />

          </Routes>
        </div>
      </BrowserRouter>
    
  );
}

export default App;
