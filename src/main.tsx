
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { FoodDonationProvider } from './contexts/FoodDonationContext.tsx';

const AppWithProviders = () => (
  <BrowserRouter>
    <AuthProvider>
      <FoodDonationProvider>
        <App />
      </FoodDonationProvider>
    </AuthProvider>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<AppWithProviders />);
