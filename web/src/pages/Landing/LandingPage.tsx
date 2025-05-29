import Navbar from '../../components/Landing/Navbar';
import Hero from '../../components/Landing/Hero';
import Features from '../../components/Landing/Features';
import HowItWorks from '../../components/Landing/HowItWorks';
import Benefits from '../../components/Landing/Benefits';
import DownloadSection from '../../components/Landing/DownloadSection';
import Footer from '../../components/Landing/Footer';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import FloatingHealthAssistant from '../../components/HealthAssistant/FloatingHealthAssistant';
import './LandingPage.css';

interface LandingPageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isAuthenticated: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ isDarkMode, toggleTheme, isAuthenticated }) => {
  return (
    <div className={`landing-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} isAuthenticated={isAuthenticated} />
      <section id="hero">
        <Hero isAuthenticated={isAuthenticated} />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="benefits">
        <Benefits />
      </section>
      <section id="download">
        <DownloadSection />
      </section>
      <Footer />
      <ScrollToTop />
      <FloatingHealthAssistant isDarkMode={isDarkMode} />
    </div>
  );
};

export default LandingPage;
