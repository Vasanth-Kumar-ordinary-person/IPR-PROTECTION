import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import theme from './utils/theme';
import store from './store/store';

// Components

import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Patents from './pages/Patents';
import FilePatent from './components/patents/FilePatent';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="app">
            <Navbar />
            <main style={{ minHeight: '100vh', paddingTop: '20px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patents" element={<Patents />} />
                <Route path="/patents/new" element={<FilePatent />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;