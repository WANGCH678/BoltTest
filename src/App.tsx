import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useScrollAnimation } from './useScrollAnimation';
import { PortfolioCard } from './PortfolioCard';
import { MouseEffect } from './MouseEffect';
import './App.css';

interface Profile {
  name_ko: string;
  name_en: string;
  job_title: string;
  intro_title: string;
  intro_desc: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  image_url: string;
  link: string;
  order_index: number;
}

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const portfolioSection = useScrollAnimation();
  const footerSection = useScrollAnimation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        );

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
        }

        const { data: portfolioData } = await supabase
          .from('portfolio')
          .select('*')
          .order('order_index', { ascending: true });

        if (portfolioData) {
          setPortfolio(portfolioData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      <MouseEffect />
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-content">
            <div className="logo">PORTFOLIO.</div>
            <a href="mailto:contact@example.com" className="nav-link">Contact Me</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <div className="hero-layout">
            <div className="hero-content">
              <div className="badge">✨ Available for new projects</div>

              <h1 className="hero-title">
                {loading ? (
                  <>
                    <div className="skeleton" style={{ width: '80%', height: '60px', marginBottom: '12px' }}></div>
                    <div className="skeleton" style={{ width: '50%', height: '60px' }}></div>
                  </>
                ) : (
                  <div dangerouslySetInnerHTML={{
                    __html: profile?.intro_title || 'Creating <span class="accent-text">Value</span><br />through Design.'
                  }} />
                )}
              </h1>

              <p className="hero-desc">
                {loading ? (
                  <>
                    <div className="skeleton" style={{ width: '100%', height: '20px', marginBottom: '8px' }}></div>
                    <div className="skeleton" style={{ width: '90%', height: '20px' }}></div>
                  </>
                ) : (
                  profile?.intro_desc
                )}
              </p>

              <div className="hero-cta">
                <a href="#portfolio" className="btn btn-primary">View Work</a>
                <a href="mailto:contact@example.com" className="btn btn-outline">Email Me</a>
              </div>
            </div>

            <div className="profile-wrapper">
              <div className="profile-card">
                <div className="profile-img">
                  <img
                    src="https://images.pexels.com/photos/3537955/pexels-photo-3537955.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Profile"
                  />
                </div>
                <div className="profile-info">
                  <div className="profile-name">
                    {loading ? 'Loading...' : `${profile?.name_ko} (${profile?.name_en})`}
                  </div>
                  <div className="profile-job">
                    {loading ? 'Loading...' : profile?.job_title}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="portfolio" ref={portfolioSection.ref as React.RefObject<HTMLElement>} className={`portfolio-section ${portfolioSection.isVisible ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Selected Work</h2>
              <p>Recent projects & experiments</p>
            </div>
          </div>

          <div className="grid-cards">
            {loading ? (
              <div className="loading-message">Loading portfolio...</div>
            ) : portfolio.length === 0 ? (
              <div className="empty-message">No portfolio items yet</div>
            ) : (
              portfolio.map((item) => (
                <PortfolioCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  year={item.year}
                  image_url={item.image_url}
                  link={item.link}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <footer ref={footerSection.ref as React.RefObject<HTMLElement>} className={`footer ${footerSection.isVisible ? 'visible' : ''}`}>
        <div className="container">
          <div className="footer-content">
            <div className="footer-col">
              <h3>Get in touch</h3>
              <div className="footer-links">
                <a href="mailto:contact@example.com">contact@example.com</a>
                <span>Seoul, South Korea</span>
              </div>
            </div>
            <div className="footer-col">
              <h3>Social</h3>
              <div className="footer-links">
                <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </div>
          </div>
          <div className="copy">
            &copy; {new Date().getFullYear()} Your Name. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
