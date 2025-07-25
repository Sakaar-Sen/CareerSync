import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  FileHeart, ShieldCheck, Zap, UserMinus, 
  ScanSearch, KeyRound, Lightbulb 
} from 'lucide-react';
import './LandingPage.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <header className="lp-header">
      <div className="logo">
        <FileHeart color="#6ee7b7" size={28} />
        <span>CareerSync</span>
      </div>
      <nav className="nav-links">
        <a href="#features">Features</a>
        <a href="#process">Process</a>
        <a href="https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs" target="_blank" rel="noopener noreferrer">Template</a>
      </nav>
      <div className="header-auth-buttons">
        {user ? (
          <>
            <Link to="/dashboard" className="header-link">Dashboard</Link>
            <button onClick={logoutUser} className="header-cta">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-link">Login</Link>
            <Link to="/register" className="header-cta">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

const HowItWorksSection = () => (
    <section id="process" className="how-it-works-section">
      <h2>How It Works</h2>
      <p className="section-subtitle">Get professional resume feedback in three simple steps</p>
      <div className="steps-container">
        <div className="step-card">
          <div className="step-number">1</div>
          <h3 className="step-title">Upload Resume</h3>
          <p className="step-description">
            Upload your resume in PDF format. Our system is optimized for fast and secure processing.
          </p>
        </div>
        <div className="step-card">
          <div className="step-number">2</div>
          <h3 className="step-title">AI Analysis</h3>
          <p className="step-description">
            Our advanced AI analyzes your resume for ATS compatibility, keywords, and content quality.
          </p>
        </div>
        <div className="step-card">
          <div className="step-number">3</div>
          <h3 className="step-title">Get Results</h3>
          <p className="step-description">
            Receive detailed feedback with actionable recommendations to improve your resume.
          </p>
        </div>
      </div>
    </section>
  );
  
  const FeaturesSection = () => (
    <section id="features" className="features-section">
      <h2>Core Analysis Features</h2>
      <p className="section-subtitle">
        Our AI evaluates your resume on key metrics for job applications.
      </p>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon"><ScanSearch color="#6ee7b7" size={28} /></div>
          <h3 className="feature-title">ATS Optimization</h3>
          <p className="feature-description">
            Ensures your resume's content is structured to be correctly read by Applicant Tracking Systems.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><KeyRound color="#6ee7b7" size={28} /></div>
          <h3 className="feature-title">Keyword Analysis</h3>
          <p className="feature-description">
            Identifies critical keywords from the job description that are missing from your resume.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Lightbulb color="#6ee7b7" size={28} /></div>
          <h3 className="feature-title">Actionable Recommendations</h3>
          <p className="feature-description">
            Get specific, clear suggestions on what to change, including rewritten text snippets.
          </p>
        </div>
      </div>
    </section>
  );
  
  const CTASection = () => {
    const navigate = useNavigate();
    return (
      <section className="cta-section">
        <h2>Ready to Improve Your Resume?</h2>
        <p>Join thousands of job seekers who have improved their resumes with our AI-powered analysis.</p>
        <button className="hero-cta" onClick={() => navigate('/analyze')}>
          Start Free Analysis
        </button>
      </section>
    );
  };

const Footer = () => (
  <footer className="lp-footer">
    <div className="footer-content">
      <p>&copy; {new Date().getFullYear()} CareerSync. All rights reserved.</p>
      <div className="footer-links">
        <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
        <Link to="/terms-of-service" className="footer-link">Terms of Service</Link>
      </div>
    </div>
  </footer>
);
  
  const LandingPage = () => {
    const navigate = useNavigate();
    return (
      <div className="landing-page">
        <Header />
        <main className="hero-section">
          <h1 className="hero-title">Get Your Resume ATS-Ready in Seconds</h1>
          <p className="hero-subtitle">
            Professional resume scoring powered by advanced AI. Get detailed feedback, 
            actionable recommendations, and improve your chances of landing interviews.
            And it's free!
          </p>
          <button className="hero-cta" onClick={() => navigate('/analyze')}>
            Upload Resume Now
          </button>
          <div className="feature-snippets">
            <div className="snippet">
              <UserMinus size={16} /><span>No account required</span>
            </div>
            <div className="snippet">
              <ShieldCheck size={16} /><span>100% confidential</span>
            </div>
            <div className="snippet">
              <Zap size={16} /><span>Instant results</span>
            </div>
          </div>
        </main>
        
        <HowItWorksSection />
        
        <FeaturesSection />
  
        <CTASection />

        <Footer />
      </div>
    );
  };

export default LandingPage;
