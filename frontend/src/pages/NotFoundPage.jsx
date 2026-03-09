import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <section className="not-found-page">
      <article className="not-found-card">
        <h2 className="not-found-card__title">Page not found</h2>
        <p className="not-found-card__description">
          The page you requested does not exist in this HRMS Lite frontend.
        </p>
        <Link className="not-found-card__link" to="/">
          Return to Dashboard
        </Link>
      </article>
    </section>
  );
}

export default NotFoundPage;
