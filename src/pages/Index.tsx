import { useState } from 'react';
import { Header } from '@/components/Header';
import { AuthModal } from '@/components/AuthModal';
import { PaywallModal } from '@/components/PaywallModal';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Landing from './Landing';
import Studio from './Studio';
import History from './History';

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paywallModalOpen, setPaywallModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header onAuthClick={() => setAuthModalOpen(true)} />
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/studio" 
          element={
            <Studio onInsufficientCredits={() => setPaywallModalOpen(true)} />
          } 
        />
        <Route path="/history" element={<History />} />
      </Routes>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <PaywallModal open={paywallModalOpen} onClose={() => setPaywallModalOpen(false)} />
    </div>
  );
};

export default Index;
