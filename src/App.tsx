import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import InfoBar from './components/layout/InfoBar';
import Footer from './components/layout/Footer';
import VolunteerPopup from './components/layout/VolunteerPopup';
import Home from './pages/Home';
import ScrollToTop from './components/ui/ScrollToTop';
import Services from './pages/Services';
import Document from './pages/Document';
import Government from './pages/Government';
import Statistics from './pages/Statistics';
import Transparency from './pages/Transparency';
import News from './pages/News';
import PrinsesaNgBaybay from './pages/PrinsesaNgBaybay';
import MiningWatch from './pages/MiningWatch';
import FareCalculator from './pages/FareCalculator';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <InfoBar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fare-calculator" element={<FareCalculator />} />
              <Route path="/services/:category" element={<Services />} />
              <Route path="/services" element={<Services />} />
              <Route
                path="/services/:category/:documentSlug"
                element={<Document categoryType="service" />}
              />
              <Route path="/government/:category" element={<Government />} />
              <Route path="/government" element={<Government />} />
              <Route
                path="/government/:category/:documentSlug"
                element={<Document categoryType="government" />}
              />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/news" element={<News />} />
              <Route
                path="/prinsesa-ng-baybay"
                element={<PrinsesaNgBaybay />}
              />
              <Route path="/mining-watch" element={<MiningWatch />} />
              <Route path="/:lang/:documentSlug" element={<Document />} />
              <Route path="/:documentSlug" element={<Document />} />
            </Routes>
            <Footer />
            <VolunteerPopup />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
