import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth-aside">
        <Link to="/" className="brand">
          <img src="/favicon.svg" alt="" width="28" height="28" />
          RateNest
        </Link>
        <div>
          <h2>Rate the stores you visit.</h2>
          <p>
            Find a store, give it 1 to 5 stars, and change your mind later. Store owners see
            who rated them and how.
          </p>
        </div>
      </aside>
      <main className="auth-main" id="main">
        <div className="auth-card">
          <div>
            <h1>{title}</h1>
            {subtitle && <p className="sub">{subtitle}</p>}
          </div>
          {children}
          {footer && <p className="auth-foot">{footer}</p>}
        </div>
      </main>
    </div>
  );
}
