import { useEffect, useState } from "react";
import "./styles/app.css";

import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import DemoClassPage from "./pages/DemoClassPage";

function getRoute() {
  const path = window.location.pathname;

  if (path === "/bookings") {
    return {
      page: "bookings",
      bookingId: null,
    };
  }

  if (path.startsWith("/demo-class/")) {
    return {
      page: "demo",
      bookingId: path.split("/demo-class/")[1],
    };
  }

  return {
    page: "home",
    bookingId: null,
  };
}

const learningPaths = [
  {
    icon: "💻",
    title: "Coding",
    color: "purple",
    description:
      "Build coding confidence with Scratch, Python, Java, JavaScript and Generative AI.",
    topics:
      "Scratch • Python • Java • JavaScript • Web Development • App Development",
  },
  {
    icon: "🌐",
    title: "Web Development",
    color: "blue",
    description:
      "Create real websites and applications while learning modern web technologies.",
    topics:
      "HTML • CSS • JavaScript • ReactJS • Backend • Databases • Express.js",
  },
  {
    icon: "📱",
    title: "App Development",
    color: "pink",
    description:
      "Turn creative ideas into interactive web and mobile applications.",
    topics:
      "Web Apps • Mobile Apps • Interactive Applications • AI Extensions",
  },
  {
    icon: "🤖",
    title: "AI",
    color: "orange",
    description:
      "Explore the world of Artificial Intelligence through practical projects.",
    topics:
      "Generative AI • AI Applications • AI Projects",
  },
  {
    icon: "➗",
    title: "Math",
    color: "green",
    description:
      "Make mathematics easier and more engaging through guided learning.",
    topics:
      "School Mathematics • Advanced Mathematics • Problem Solving",
  },
  {
    icon: "🔬",
    title: "Science",
    color: "cyan",
    description:
      "Discover how the world works through exciting science learning.",
    topics:
      "School Science • Concepts • Experiments • Discovery",
  },
  {
    icon: "🇬🇧",
    title: "English",
    color: "violet",
    description:
      "Build confidence in communication, speaking and writing.",
    topics:
      "Communication • Speaking • Writing • English Skills",
  },
  {
    icon: "🦾",
    title: "Robotics",
    color: "red",
    description:
      "Learn technology by designing, building and experimenting with robotics.",
    topics:
      "Robotics • Technology • Hardware • Projects",
  },
  {
    icon: "💰",
    title: "Financial Literacy",
    color: "yellow",
    description:
      "Introduce children to practical financial concepts and money management.",
    topics:
      "Financial Concepts • Money Management • Fundamentals",
  },
];

function Header() {
  const goTo = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <button
          type="button"
          className="brand-button"
          onClick={() => goTo("/")}
          aria-label="Go to CodeYoung home"
        >
          <span className="logo-mark">
            ✦
          </span>

          <span className="logo">
            CodeYoung
          </span>
        </button>

        <nav className="nav-links">
          <button type="button" onClick={() => goTo("/")}>
            Home
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.location.pathname !== "/") {
                goTo("/");
                setTimeout(() => {
                  document
                    .getElementById("learning-paths")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              } else {
                document
                  .getElementById("learning-paths")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Courses
          </button>

          <button type="button" onClick={() => goTo("/bookings")}>
            My Bookings
          </button>

          <button
            type="button"
            className="nav-cta"
            onClick={() => goTo("/")}
          >
            Book FREE Trial
          </button>
        </nav>
      </div>
    </header>
  );
}

function HomePage() {
  const goToBooking = () => {
    document
      .getElementById("booking-section")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <>
      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="creative-hero">
        {/* Decorative elements */}

        <span className="hero-decoration hero-star-one">
          ✦
        </span>

        <span className="hero-decoration hero-star-two">
          ✨
        </span>

        <span className="hero-decoration hero-star-three">
          ★
        </span>

        <span className="hero-decoration hero-doodle">
          ~
        </span>

        <div className="hero-bubble bubble-one">
          💻
        </div>

        <div className="hero-bubble bubble-two">
          🚀
        </div>

        <div className="hero-bubble bubble-three">
          🧠
        </div>

        <div className="hero-content">
          <div className="hero-small-badge">
            ✨ LEARNING MADE FUN
          </div>

          <h1>
            Learn.
            <br />
            Create.
            <br />
            <span>Build the future.</span>
          </h1>

          <p>
            Give your child a fun and personalized learning
            experience with expert mentors and exciting
            technology-driven courses.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-primary-button"
              onClick={goToBooking}
            >
              🎁 Book a FREE Trial
            </button>

            <button
              type="button"
              className="hero-secondary-button"
              onClick={() =>
                document
                  .getElementById("learning-paths")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore Courses ↓
            </button>
          </div>

          <div className="hero-trust">
            <span>✓ Expert Mentors</span>
            <span>✓ Personalized Learning</span>
            <span>✓ Interactive Classes</span>
          </div>
        </div>

        {/* =================================================
            HERO ILLUSTRATION
            ================================================= */}

        <div className="hero-visual">
          <div className="visual-glow"></div>

          <div className="visual-card-main">
            <div className="visual-top">
              <span className="visual-dot"></span>
              <span className="visual-dot"></span>
              <span className="visual-dot"></span>
            </div>

            <div className="student-illustration">
              <div className="student-head">
                🧑‍💻
              </div>

              <div className="student-screen">
                <span>{"<"}</span>
                <span>CODE</span>
                <span>{"/>"}</span>
              </div>
            </div>

            <div className="visual-learning">
              <strong>
                Today's Learning
              </strong>

              <div className="learning-progress">
                <span></span>
              </div>

              <small>
                Building something amazing 🚀
              </small>
            </div>
          </div>

          <div className="floating-learning-card floating-one">
            <span>🤖</span>
            <div>
              <strong>AI</strong>
              <small>Explore & Create</small>
            </div>
          </div>

          <div className="floating-learning-card floating-two">
            <span>➗</span>
            <div>
              <strong>Math</strong>
              <small>Learn by doing</small>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LEARNING PATHS
          ===================================================== */}

      <section
        id="learning-paths"
        className="learning-section"
      >
        <div className="section-heading">
          <span className="section-kicker">
            ✦ EXPLORE & DISCOVER
          </span>

          <h2>
            Something exciting
            <br />
            <span>for every curious mind.</span>
          </h2>

          <p>
            Explore learning paths designed to help children
            discover their interests, build confidence and
            create amazing things.
          </p>
        </div>

        <div className="learning-grid">
          {learningPaths.map((course, index) => (
            <article
              className={`learning-card ${course.color}`}
              key={course.title}
            >
              <div className="course-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="course-icon">
                {course.icon}
              </div>

              <h3>
                {course.title}
              </h3>

              <p>
                {course.description}
              </p>

              <div className="course-topics">
                {course.topics}
              </div>

              <span className="course-arrow">
                →
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================
          WHY SECTION
          ===================================================== */}

      <section className="why-section">
        <div className="why-visual">
          <span className="why-star">✦</span>

          <div className="why-main-card">
            <div className="why-emoji">
              🧠
            </div>

            <h3>
              Learning should feel
              <br />
              like an adventure.
            </h3>

            <div className="why-pills">
              <span>Create</span>
              <span>Explore</span>
              <span>Build</span>
            </div>
          </div>

          <div className="why-floating">
            ⭐
          </div>
        </div>

        <div className="why-content">
          <span className="section-kicker">
            WHY LEARNING WITH US?
          </span>

          <h2>
            More than a class.
            <br />
            <span>A learning journey.</span>
          </h2>

          <p>
            Every child learns differently. Our trial class
            helps parents discover a learning experience that
            matches their child's interests and curiosity.
          </p>

          <div className="benefits">
            <div className="benefit">
              <div className="benefit-icon">
                👨‍🏫
              </div>

              <div>
                <strong>
                  Expert Mentors
                </strong>

                <p>
                  Learn with dedicated mentors who make
                  complex ideas easier to understand.
                </p>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                🎯
              </div>

              <div>
                <strong>
                  Personalized Learning
                </strong>

                <p>
                  Learning experiences designed around
                  the child's pace and interests.
                </p>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                🚀
              </div>

              <div>
                <strong>
                  Learn by Building
                </strong>

                <p>
                  Turn concepts into projects and
                  exciting real-world creations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
          ===================================================== */}

      <section className="trial-cta">
        <span className="cta-decoration cta-one">
          ✦
        </span>

        <span className="cta-decoration cta-two">
          ✨
        </span>

        <div className="cta-content">
          <span className="section-kicker light">
            READY TO START?
          </span>

          <h2>
            Let curiosity
            <br />
            lead the way. 🚀
          </h2>

          <p>
            Book a free trial class and let your child
            experience learning differently.
          </p>

          <button
            type="button"
            className="cta-button"
            onClick={goToBooking}
          >
            🎁 Book a FREE Trial
          </button>
        </div>
      </section>

      {/* =====================================================
          BOOKING SECTION
          ===================================================== */}

      <section
        id="booking-section"
        className="booking-section-wrapper"
      >
        <div className="booking-section-heading">
          <span className="section-kicker">
            ✦ FREE TRIAL CLASS
          </span>

          <h2>
            Let's find the
            <br />
            perfect time.
          </h2>

          <p>
            Tell us a little about yourself and choose a
            convenient time for your trial class.
          </p>
        </div>

        <BookingPage />
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer className="app-footer creative-footer">
      <div className="footer-brand">
        <span className="footer-logo-mark">
          ✦
        </span>

        <strong>
          CodeYoung
        </strong>
      </div>

      <p>
        Learn. Create. Build the future.
      </p>

      <div className="footer-symbols">
        💻 &nbsp; 🤖 &nbsp; 🧠 &nbsp; 🚀 &nbsp; ✨
      </div>

      <small>
        Trial Class Booking Platform
      </small>
    </footer>
  );
}

export default function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const handleNavigation = () => {
      setRoute(getRoute());
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    };

    window.addEventListener(
      "popstate",
      handleNavigation
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handleNavigation
      );
    };
  }, []);

  return (
    <div className="app-shell">
      <Header />

      {route.page === "home" && (
        <HomePage />
      )}

      {route.page === "bookings" && (
        <BookingsPage />
      )}

      {route.page === "demo" && (
        <DemoClassPage
          bookingId={route.bookingId}
        />
      )}

      <Footer />
    </div>
  );
}