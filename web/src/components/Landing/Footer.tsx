import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';
import './Footer.css';

const Footer = () => {
  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/images/lifeguard-2.svg" alt="LifeGuard" className="footer-logo" />
            <div className="social-links">
              <a
                href="https://github.com/AWESOME04/LifeGuard"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://twitter.com/LifeGuardApp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com/company/lifeguard-app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Product</h3>
            <AccessibleDropdown
              isOpen={false}
              onToggle={() => scrollToSection('features')}
              ariaLabel="Go to Features section"
              className="footer-link-button"
            >
              Features
            </AccessibleDropdown>

            <AccessibleDropdown
              isOpen={false}
              onToggle={() => scrollToSection('how-it-works')}
              ariaLabel="Go to How It Works section"
              className="footer-link-button"
            >
              How It Works
            </AccessibleDropdown>

            <AccessibleDropdown
              isOpen={false}
              onToggle={() => scrollToSection('benefits')}
              ariaLabel="Go to Benefits section"
              className="footer-link-button"
            >
              Benefits
            </AccessibleDropdown>

            <AccessibleDropdown
              isOpen={false}
              onToggle={() => scrollToSection('download')}
              ariaLabel="Go to Download section"
              className="footer-link-button"
            >
              Download
            </AccessibleDropdown>
          </div>

          <div className="footer-links">
            <h3>Company</h3>
            <AccessibleDropdown
              isOpen={false}
              onToggle={() => scrollToSection('about')}
              ariaLabel="Go to About section"
              className="footer-link-button"
            >
              About
            </AccessibleDropdown>

            <AccessibleDropdown
              isOpen={false}
              onToggle={() => scrollToSection('contact')}
              ariaLabel="Go to Contact section"
              className="footer-link-button"
            >
              Contact
            </AccessibleDropdown>

            <AccessibleDropdown
              isOpen={false}
              onToggle={() => scrollToSection('careers')}
              ariaLabel="Go to Careers section"
              className="footer-link-button"
            >
              Careers
            </AccessibleDropdown>
          </div>

          <div className="footer-links">
            <h3>Resources</h3>
            <AccessibleDropdown
              isOpen={false}
              onToggle={() => scrollToSection('help')}
              ariaLabel="Go to Help Center section"
              className="footer-link-button"
            >
              Help Center
            </AccessibleDropdown>

            <AccessibleDropdown
              isOpen={false}
              onToggle={() => scrollToSection('terms-of-use')}
              ariaLabel="Go to Terms of Use section"
              className="footer-link-button"
            >
              Terms of Use
            </AccessibleDropdown>

            <AccessibleDropdown
              isOpen={false}
              onToggle={() => scrollToSection('privacy-policy')}
              ariaLabel="Go to Privacy Policy section"
              className="footer-link-button"
            >
              Privacy Policy
            </AccessibleDropdown>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LifeGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
