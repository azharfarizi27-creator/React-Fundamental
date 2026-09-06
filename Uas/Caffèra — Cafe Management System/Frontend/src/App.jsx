import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <OrderProvider>
            <AppRoutes />
          </OrderProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
export default App;
