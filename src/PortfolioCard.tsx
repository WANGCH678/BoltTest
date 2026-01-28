import { useScrollAnimation } from './useScrollAnimation';

interface PortfolioCardProps {
  title: string;
  description: string;
  tags: string[];
  year: string;
  image_url: string;
  link: string;
}

export function PortfolioCard({
  title,
  description,
  tags,
  year,
  image_url,
  link
}: PortfolioCardProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <article
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`card ${isVisible ? 'visible' : ''}`}
    >
      <div className="card-thumb">
        <img
          src={image_url || 'https://via.placeholder.com/400x250?text=No+Image'}
          alt={title}
          loading="lazy"
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>
        <div className="tags-container">
          {tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="card-meta">
        <span>{year}</span>
        <a href={link || '#'} target="_blank" rel="noopener noreferrer" className="link-arrow">
          View Project
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </article>
  );
}
