import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import StarRating, { RatingInput } from "../components/StarRating";
import { useAuth } from "../hooks/useAuth";
import { HOME_BY_ROLE } from "../utils/roles";
import "../styles/landing.css";

const STEPS = [
  {
    title: "Create a free account",
    text: "Sign up with your name, email and address. Public sign-up always creates a normal user account.",
  },
  {
    title: "Find a store",
    text: "Search by store name or by address, then sort by name or by rating.",
  },
  {
    title: "Rate it from 1 to 5",
    text: "Submit one rating per store. Changed your mind? Update it whenever you like.",
  },
];

const AUDIENCES = [
  {
    who: "For shoppers",
    title: "See the rating before you go",
    points: [
      "Every store shows its overall average",
      "Your own rating sits next to it",
      "Search by name or address",
    ],
  },
  {
    who: "For store owners",
    title: "See who rated your store",
    points: [
      "Average rating for each of your stores",
      "Every user who rated, with their email and score",
      "Date of each rating",
    ],
  },
  {
    who: "For administrators",
    title: "Run the whole platform",
    points: [
      "Totals for users, stores and ratings",
      "Add users, store owners and stores",
      "Filter and sort every table",
    ],
  },
];

const FAQS = [
  {
    q: "What is RateNest?",
    a: "RateNest is a store rating platform. Registered users find stores and rate them from 1 to 5, and the overall rating of each store is the average of all ratings it has received.",
  },
  {
    q: "Can I change a rating after I submit it?",
    a: "Yes. Each user has one rating per store and can update it at any time. The store's overall rating changes with it.",
  },
  {
    q: "How do I become a store owner on RateNest?",
    a: "Store owner accounts are created by an administrator, who also links the account to a store. Public sign-up only creates normal user accounts.",
  },
  {
    q: "Who can see my rating?",
    a: "The owner of the store can see the name, email and rating of each user who rated their store. Administrators can see user details. Other users only see the store's overall average.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

function HeroDemo() {
  const [rating, setRating] = useState(4);

  return (
    <div className="demo" aria-labelledby="demo-title">
      <p className="demo-tag">Example store</p>
      <h2 id="demo-title">Green Basket Organic Grocery Store</h2>
      <p className="demo-address">12 MG Road, Pune 411001</p>

      <div className="demo-row">
        <span className="demo-label">Overall rating</span>
        <StarRating value={4.2} />
      </div>
      <div className="demo-row">
        <span className="demo-label">Your rating</span>
        <RatingInput value={rating} onChange={setRating} label="Try rating the example store" />
      </div>
      <p className="demo-hint">Tap a star to try it. Nothing is saved.</p>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();

  if (user) return <Navigate to={HOME_BY_ROLE[user.role]} replace />;

  return (
    <div className="landing">
      <script type="application/ld+json">{JSON.stringify(FAQ_JSON_LD)}</script>

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="l-header">
        <div className="l-wrap l-header-inner">
          <Link to="/" className="brand">
            <img src="/favicon.svg" alt="" width="24" height="24" />
            RateNest
          </Link>
          <nav aria-label="Main" className="l-nav">
            <a href="#how">How it works</a>
            <a href="#roles">Who it is for</a>
            <a href="#faq">Questions</a>
          </nav>
          <div className="l-header-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="l-hero">
          <div className="l-wrap l-hero-grid">
            <div>
              <h1>Know which stores are worth the trip.</h1>
              <p className="l-lead">
                RateNest collects 1 to 5 star ratings from real users, so every store has an
                honest average you can check before you go.
              </p>
              <div className="l-cta">
                <Link to="/register" className="btn btn-primary">
                  Create a free account
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Log in
                </Link>
              </div>
            </div>
            <HeroDemo />
          </div>
        </section>

        <section className="l-section" id="how" aria-labelledby="how-h">
          <div className="l-wrap">
            <h2 id="how-h">How it works</h2>
            <ol className="steps">
              {STEPS.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="l-section l-tint" id="roles" aria-labelledby="roles-h">
          <div className="l-wrap">
            <h2 id="roles-h">One login, three views</h2>
            <p className="l-sub">
              Your role decides what you see after you log in. The server checks it on every
              request, not just the screen.
            </p>
            <div className="roles">
              {AUDIENCES.map((item) => (
                <article key={item.who} className="role">
                  <p className="role-who">{item.who}</p>
                  <h3>{item.title}</h3>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="l-section" id="faq" aria-labelledby="faq-h">
          <div className="l-wrap l-narrow">
            <h2 id="faq-h">Questions</h2>
            <div className="faq">
              {FAQS.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="l-final" aria-labelledby="final-h">
          <div className="l-wrap l-final-inner">
            <h2 id="final-h">Rate your first store today.</h2>
            <Link to="/register" className="btn btn-secondary">
              Create a free account
            </Link>
          </div>
        </section>
      </main>

      <footer className="l-footer">
        <div className="l-wrap l-footer-inner">
          <span className="brand">
            <img src="/favicon.svg" alt="" width="20" height="20" />
            RateNest
          </span>
          <nav aria-label="Footer">
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
