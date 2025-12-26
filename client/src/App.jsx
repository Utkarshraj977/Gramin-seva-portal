import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';



function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Home Page wrapped in Layout */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        }
        />
        
        {/* Add more routes here as you build, e.g., /services/agriculture */}

      </Routes>
    </Router>
  );
}

export default App;