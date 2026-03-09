import './PageContainer.css';

function PageContainer({ title, subtitle, actions, children }) {
  return (
    <section className="page-container">
      <header className="page-container__header">
        <div>
          <h2 className="page-container__title">{title}</h2>
          {subtitle ? <p className="page-container__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      <div className="page-container__body">{children}</div>
    </section>
  );
}

export default PageContainer;
