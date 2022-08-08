import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { Footer, Navbar } from './components';
import { Home, ProductDetails, Success } from './containers';

const App = () => {
  const location =useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <div className='layout'>
        <Navbar />
        <main className="main-container">
          <Toaster />
          <Routes>
              <Route path='/' element={ <Home /> } />
              <Route path='/products/:name' element={ <ProductDetails /> } />
              <Route path='/success' element={ <Success /> } />
          </Routes>
        </main>
        <Footer />
    </div>
  )
}

export default App;