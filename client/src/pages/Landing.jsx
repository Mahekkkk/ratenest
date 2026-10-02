import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import CountUp from "../components/CountUp";
import Reveal from "../components/Reveal";
import StarRating, { RatingInput } from "../components/StarRating";
import { useAuth } from "../hooks/useAuth";
import { prefersReducedMotion, useInView } from "../hooks/useInView";
import { HOME_BY_ROLE } from "../utils/roles";
import "../styles/landing.css";

const HEADLINE = ["Know", "which", "stores", "are", "worth", "the", "trip."];

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

// Example from the project spec: ratings 5, 4, 4 and 3 average to 4.0.
const EXAMPLE_RATINGS = [5, 4, 4, 3];

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

const SECTIONS = [
  { id: "how", label: "How it works" },
  { id: "average", label: "The average" },
  { id: "roles", label: "Who it is for" },
  { id: "faq", label: "Questions" },
];

const FLOATERS = [
  { left: "6%", top: "14%", size: 28, dur: 9, delay: 0 },
  { left: "44%", top: "8%", size: 18, dur: 11, delay: -3 },
  { left: "88%", top: "12%", size: 34, dur: 10, delay: -5 },
  { left: "52%", top: "78%", size: 22, dur: 12, delay: -2 },
  { left: "3%", top: "70%", size: 20, dur: 8, delay: -6 },
  { left: "93%", top: "66%", size: 16, dur: 13, delay: -4 },
];

function Floaters() {
  return (
    <div className="floaters" aria-hidden="true">
      {FLOATERS.map((item) => (
        <svg
          key={item.left + item.top}
          viewBox="0 0 24 24"
          className="floater"
          style={{
            left: item.left,
            top: item.top,
            width: item.size,
            height: item.size,
            "--dur": `${item.dur}s`,
            "--delay": `${item.delay}s`,
          }}
        >
          <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9z" />
        </svg>
      ))}
    </div>
  );
}

function HeroDemo() {
  const [rating, setRating] = useState(4);
  const cardRef = useRef(null);

  // Card tilts toward the pointer. Skipped for touch and reduced motion.
  const handleMove = (event) => {
    const card = cardRef.current;
    if (!card || event.pointerType !== "mouse" || prefersReducedMotion()) return;

    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    card.style.setProperty("--ry", `${x * 9}deg`);
    card.style.setProperty("--rx", `${-y * 9}deg`);
  };

  const handleLeave = () => {
    cardRef.current?.style.setProperty("--ry", "0deg");
    cardRef.current?.style.setProperty("--rx", "0deg");
  };

  return (
    <div className="demo-wrap" onPointerMove={handleMove} onPointerLeave={handleLeave}>
      <div className="demo" ref={cardRef} aria-labelledby="demo-title">
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
    </div>
  );
}

function AverageDemo() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const total = EXAMPLE_RATINGS.length;
  const average = EXAMPLE_RATINGS.reduce((sum, value) => sum + value, 0) / total;

  return (
    <div ref={ref} className={`avg${inView ? " in" : ""}`}>
      <p className="avg-number" aria-label={`Average ${average.toFixed(1)} out of 5`}>
        <CountUp to={average} start={inView} />
        <span className="avg-of"> / 5</span>
      </p>
      <p className="avg-formula">
        ({EXAMPLE_RATINGS.join(" + ")}) / {total} = {average.toFixed(1)}
      </p>
      <ul className="avg-bars" aria-label="Example ratings per score">
        {[5, 4, 3, 2, 1].map((score, index) => {
          const count = EXAMPLE_RATINGS.filter((value) => value === score).length;

          return (
            <li key={score}>
              <span>
                {score} {score === 1 ? "star" : "stars"}
              </span>
              <span className="avg-track" aria-hidden="true">
                <span style={{ "--w": count / total, "--i": index }} />
              </span>
              <span className="avg-count">{count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const rootRef = useRef(null);
  const [active, setActive] = useState("");

  // Scroll position and progress feed CSS custom properties (parallax, progress bar, header shadow).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll", String(Math.round(window.scrollY)));
      root.style.setProperty("--progress", max > 0 ? String(window.scrollY / max) : "0");
      root.toggleAttribute("data-scrolled", window.scrollY > 8);
      if (window.scrollY < 200) setActive("");
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [user]);

  // Highlights the nav link of the section currently in the middle of the screen.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    SECTIONS.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [user]);

  if (user) return <Navigate to={HOME_BY_ROLE[user.role]} replace />;

  return (
    <div className="landing" ref={rootRef}>
      <script type="application/ld+json">{JSON.stringify(FAQ_JSON_LD)}</script>
      <div className="progress" aria-hidden="true" />

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
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={active === section.id ? "location" : undefined}
              >
                {section.label}
              </a>
            ))}
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
          <Floaters />
          <div className="l-wrap l-hero-grid">
            <div>
              <h1>
                {HEADLINE.map((word, index) => (
                  <span className="word" key={word + index} style={{ "--i": index }}>
                    {word}{" "}
                  </span>
                ))}
              </h1>
              <p className="l-lead rise" style={{ "--i": 8 }}>
                RateNest collects 1 to 5 star ratings from real users, so every store has an
                honest average you can check before you go.
              </p>
              <div className="l-cta rise" style={{ "--i": 10 }}>
                <Link to="/register" className="btn btn-primary">
                  Create a free account
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Log in
                </Link>
              </div>
            </div>
            <div className="rise rise-card" style={{ "--i": 5 }}>
              <HeroDemo />
            </div>
          </div>
          <a href="#how" className="scroll-cue" aria-label="Scroll to how it works">
            <span aria-hidden="true" />
          </a>
        </section>

        <section className="l-section" id="how" aria-labelledby="how-h">
          <div className="l-wrap">
            <Reveal as="h2" id="how-h">
              How it works
            </Reveal>
            <ol className="steps">
              {STEPS.map((step, index) => (
                <Reveal as="li" key={step.title} delay={index * 120}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="l-section l-tint" id="average" aria-labelledby="avg-h">
          <div className="l-wrap avg-grid">
            <div>
              <Reveal as="h2" id="avg-h">
                The average is just arithmetic
              </Reveal>
              <Reveal as="p" className="l-sub" delay={100}>
                A store&apos;s overall rating is the mean of every rating it has received. When
                someone updates their rating, the average moves with it. Nothing is stored
                separately, so it can never drift out of date.
              </Reveal>
            </div>
            <Reveal delay={150}>
              <AverageDemo />
            </Reveal>
          </div>
        </section>

        <section className="l-section" id="roles" aria-labelledby="roles-h">
          <div className="l-wrap">
            <Reveal as="h2" id="roles-h">
              One login, three views
            </Reveal>
            <Reveal as="p" className="l-sub" delay={100}>
              Your role decides what you see after you log in. The server checks it on every
              request, not just the screen.
            </Reveal>
            <div className="roles">
              {AUDIENCES.map((item, index) => (
                <Reveal as="article" key={item.who} className="role" delay={index * 140}>
                  <p className="role-who">{item.who}</p>
                  <h3>{item.title}</h3>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="l-section l-tint" id="faq" aria-labelledby="faq-h">
          <div className="l-wrap l-narrow">
            <Reveal as="h2" id="faq-h">
              Questions
            </Reveal>
            <div className="faq">
              {FAQS.map((item, index) => (
                <Reveal as="div" key={item.q} delay={index * 80}>
                  <details>
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="l-final" aria-labelledby="final-h">
          <Floaters />
          <div className="l-wrap l-final-inner">
            <Reveal as="h2" id="final-h">
              Rate your first store today.
            </Reveal>
            <Reveal delay={120}>
              <Link to="/register" className="btn btn-secondary">
                Create a free account
              </Link>
            </Reveal>
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
