import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';

const App = () => {
  return (
    <AuthProvider>
      <MessageProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </MessageProvider>
    </AuthProvider>
  );
};

export default App;