import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InteractiveScenarioDemo } from './components/InteractiveScenarioDemo';
import { PrototypeShowcase } from './components/PrototypeShowcase';
import { getInitialLang, t, type Lang } from './i18n';

type ThemeMode = 'light' | 'dark';

const LINKEDIN_URL = 'https://www.linkedin.com/company/112662759';
const SALMA_LINKEDIN = 'https://www.linkedin.com/in/salma-u-258530363/';
const JEWELS_LINKEDIN = 'https://www.linkedin.com/in/jewels-z-41059b389/';

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem('dialago-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setThemeOnDocument(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
}

function useRevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (nodes.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        }
      },
      { root: null, threshold: 0.14, rootMargin: '0px 0px -10% 0px' },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.5 9.5V20M6.5 6.75a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM10 20v-6.2c0-2.2 1.2-3.4 3-3.4 1.65 0 2.75 1.1 2.75 3.35V20H20V12.4c0-3.65-1.95-5.35-4.55-5.35-2.1 0-3.05 1.15-3.55 1.95V9.65H10c.05 1.1 0 10.35 0 10.35z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2l1.2 5.1a2 2 0 0 0 1.5 1.5L20 10l-5.3 1.4a2 2 0 0 0-1.5 1.5L12 18l-1.2-5.1a2 2 0 0 0-1.5-1.5L4 10l5.3-1.4a2 2 0 0 0 1.5-1.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 18.5l.5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5.5-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarField({
  className,
  density = 10,
}: {
  className?: string;
  density?: number;
}) {
  const stars = useMemo(() => {
    const base = [
      { x: 8, y: 18, s: 0.85, o: 0.22, d: 0 },
      { x: 18, y: 62, s: 0.55, o: 0.18, d: 0.4 },
      { x: 32, y: 10, s: 0.45, o: 0.16, d: 0.9 },
      { x: 44, y: 38, s: 0.65, o: 0.22, d: 1.4 },
      { x: 56, y: 14, s: 0.5, o: 0.18, d: 2.1 },
      { x: 66, y: 58, s: 0.85, o: 0.22, d: 2.8 },
      { x: 74, y: 26, s: 0.4, o: 0.14, d: 3.2 },
      { x: 86, y: 44, s: 0.7, o: 0.22, d: 3.9 },
      { x: 92, y: 18, s: 0.45, o: 0.16, d: 4.3 },
      { x: 12, y: 86, s: 0.75, o: 0.2, d: 4.7 },
      { x: 40, y: 84, s: 0.5, o: 0.16, d: 5.2 },
      { x: 70, y: 86, s: 0.6, o: 0.18, d: 5.6 },
    ];
    return base.slice(0, Math.max(4, Math.min(base.length, density)));
  }, [density]);

  return (
    <div className={className ? `stars ${className}` : 'stars'} aria-hidden="true">
      {stars.map((st, idx) => (
        <span
          key={idx}
          className="star"
          style={
            {
              left: `${st.x}%`,
              top: `${st.y}%`,
              opacity: st.o,
              transform: `translate(-50%, -50%) scale(${st.s})`,
              animationDelay: `${st.d}s`,
            } as React.CSSProperties
          }
        >
          <SparkIcon />
        </span>
      ))}
    </div>
  );
}

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [lang, setLang] = useState<Lang>(() => getInitialLang());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroStage, setHeroStage] = useState<'page1' | 'page2'>('page1');
  const headerRef = useRef<HTMLElement | null>(null);
  const page2Ref = useRef<HTMLElement | null>(null);

  useRevealOnScroll();

  useEffect(() => {
    setThemeOnDocument(theme);
    localStorage.setItem('dialago-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dialago-lang', lang);
    document.documentElement.lang = lang === 'es' ? 'es' : 'en';
  }, [lang]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const node = page2Ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setHeroStage('page2');
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30% 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const nav = useMemo(
    () => [
      { id: 'about', label: t(lang, 'nav.about') },
      { id: 'how', label: t(lang, 'nav.how') },
      { id: 'features', label: t(lang, 'nav.features') },
      { id: 'pricing', label: t(lang, 'nav.pricing') },
      { id: 'contact', label: t(lang, 'nav.contact') },
    ],
    [lang],
  );

  const onNavClick = (id: string) => {
    setMobileMenuOpen(false);
    scrollToId(id);
  };

  return (
    <div className="site">
      <header className="top" ref={(n) => (headerRef.current = n)}>
        <div className="container top__inner">
          <button
            className="brand"
            onClick={() => scrollToId('top')}
            type="button"
            aria-label={t(lang, 'a11y.goTop')}
          >
            <span className="brand__mark" aria-hidden="true">
              <SparkIcon />
            </span>
            <span className="brand__name">DialaGO</span>
          </button>

          <nav className="nav" aria-label={t(lang, 'a11y.primaryNav')}>
            {nav.map((item) => (
              <button
                key={item.id}
                className="nav__link"
                type="button"
                onClick={() => onNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="top__actions">
            <button
              className="iconBtn"
              type="button"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label={theme === 'dark' ? t(lang, 'a11y.themeDark') : t(lang, 'a11y.themeLight')}
              title={theme === 'dark' ? t(lang, 'a11y.themeTitleDark') : t(lang, 'a11y.themeTitleLight')}
            >
              <span className="iconBtn__dot" aria-hidden="true" />
            </button>

            <a className="btn btn--primary" href="#pricing" onClick={(e) => (e.preventDefault(), onNavClick('pricing'))}>
              {t(lang, 'hero.download')}
            </a>

            <div className="langSwitch" role="group" aria-label={t(lang, 'lang.switch')}>
              <button
                type="button"
                className={lang === 'en' ? 'langSwitch__btn langSwitch__btn--active' : 'langSwitch__btn'}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
              >
                {t(lang, 'lang.en')}
              </button>
              <button
                type="button"
                className={lang === 'es' ? 'langSwitch__btn langSwitch__btn--active' : 'langSwitch__btn'}
                onClick={() => setLang('es')}
                aria-pressed={lang === 'es'}
              >
                {t(lang, 'lang.es')}
              </button>
            </div>

            <button
              className="hamburger"
              type="button"
              aria-label={t(lang, 'a11y.openMenu')}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={mobileMenuOpen ? 'mobileNav mobileNav--open' : 'mobileNav'} role="dialog" aria-label={t(lang, 'a11y.menu')}>
          <div className="mobileNav__panel">
            {nav.map((item) => (
              <button
                key={item.id}
                className="mobileNav__link"
                type="button"
                onClick={() => onNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
            <a className="mobileNav__cta" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
              {t(lang, 'hero.linkedin')}
            </a>
          </div>
          <button
            className="mobileNav__backdrop"
            type="button"
            aria-label={t(lang, 'a11y.closeMenu')}
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      </header>

      <main id="top" className="main">
        <section className="hero container">
          <div className="hero__panel hero__panel--stage1">
            <div className="heroStage">
              <div className="hero__copy hero__copy--stage1">
                <div className="kicker">
                  <span className="kicker__pill">{t(lang, 'hero.kickerPill')}</span>
                  <span className="kicker__text">{t(lang, 'hero.kickerText')}</span>
                </div>
                <div className="headlineWrap">
                  <h1 className="h1">{t(lang, 'hero.h1')}</h1>
                  <StarField className="stars--headline" density={8} />
                </div>
                <p className="lead">{t(lang, 'hero.lead')}</p>
                <div className="hero__ctaRow">
                  <a
                    className="btn btn--primary"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-label={t(lang, 'a11y.downloadSoon')}
                  >
                    {t(lang, 'hero.download')}
                    <span className="btn__tag">{t(lang, 'hero.comingSoon')}</span>
                  </a>
                  <a className="btn btn--ghost" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                    {t(lang, 'hero.linkedin')}
                  </a>
                </div>

                <div className="chips">
                  <span className="chip">
                    <SparkIcon className="chip__icon" /> {t(lang, 'hero.chip1')}
                  </span>
                  <span className="chip">
                    <SparkIcon className="chip__icon" /> {t(lang, 'hero.chip2')}
                  </span>
                  <span className="chip">
                    <SparkIcon className="chip__icon" /> {t(lang, 'hero.chip3')}
                  </span>
                </div>
              </div>

              <div className={heroStage === 'page2' ? 'heroBrand heroBrand--shown' : 'heroBrand'} aria-hidden="true">
                <div className="heroBrand__word">DialaGO</div>
                <StarField className="stars--brand" density={7} />
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(n) => (page2Ref.current = n)}
          className="page2 container"
          aria-label={t(lang, 'a11y.page2')}
          data-reveal
        >
          <div className="hero__panel hero__panel--stage2">
            <StarField density={10} />
            <div className="page2__grid">
              <div className="page2__lead">
                <div className="section__header section__header--page2">
                  <div className="section__index">01</div>
                  <div>
                    <h2 className="h2">{t(lang, 'page2.h2')}</h2>
                    <p className="muted">{t(lang, 'page2.muted')}</p>
                  </div>
                </div>
              </div>

              <div className="hero__visual hero__visual--page2" aria-label={t(lang, 'a11y.productPreview')}>
                <div className="device">
                  <div className="device__screen">
                    <div className="mock">
                      <div className="mock__row">
                        <div className="mock__badge">{t(lang, 'mock.onboarding')}</div>
                        <div className="mock__title">{t(lang, 'mock.title')}</div>
                      </div>
                      <div className="mock__card floatCard floatCard--1">
                        <div className="mock__label">{t(lang, 'mock.work')}</div>
                        <div className="mock__value">{t(lang, 'mock.workVal')}</div>
                      </div>
                      <div className="mock__card floatCard floatCard--2">
                        <div className="mock__label">{t(lang, 'mock.errands')}</div>
                        <div className="mock__value">{t(lang, 'mock.errandsVal')}</div>
                      </div>
                      <div className="mock__card mock__card--dark floatCard floatCard--3">
                        <div className="mock__label">{t(lang, 'mock.podcast')}</div>
                        <div className="mock__value">{t(lang, 'mock.podcastVal')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stats" aria-label={t(lang, 'a11y.keyNumbers')}>
                  <div className="stat">
                    <div className="stat__num">01</div>
                    <div className="stat__label">{t(lang, 'stat.1')}</div>
                  </div>
                  <div className="stat">
                    <div className="stat__num">02</div>
                    <div className="stat__label">{t(lang, 'stat.2')}</div>
                  </div>
                  <div className="stat">
                    <div className="stat__num">03</div>
                    <div className="stat__label">{t(lang, 'stat.3')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section container" data-reveal>
          <div className="section__header">
            <div className="section__index">01</div>
            <div>
              <h2 className="h2">{t(lang, 'about.h2')}</h2>
              <p className="muted">{t(lang, 'about.muted')}</p>
            </div>
          </div>

          <div className="grid grid--2">
            <div className="card">
              <h3 className="h3">{t(lang, 'about.problem')}</h3>
              <p className="p">{t(lang, 'about.problemP1')}</p>
              <p className="p">{t(lang, 'about.problemP2')}</p>
            </div>

            <div className="card card--soft">
              <h3 className="h3">{t(lang, 'about.building')}</h3>
              <p className="p">{t(lang, 'about.buildingP')}</p>
              <ul className="list">
                <li>{t(lang, 'about.li1')}</li>
                <li>{t(lang, 'about.li2')}</li>
                <li>{t(lang, 'about.li3')}</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="how" className="section container" data-reveal>
          <div className="section__header">
            <div className="section__index">02</div>
            <div>
              <h2 className="h2">{t(lang, 'how.h2')}</h2>
              <p className="muted">{t(lang, 'how.muted')}</p>
            </div>
          </div>

          <div className="grid grid--3">
            <div className="card">
              <div className="step">
                <div className="step__num">01</div>
                <h3 className="h3">{t(lang, 'how.s1Title')}</h3>
              </div>
              <p className="p">{t(lang, 'how.s1P')}</p>
              <p className="p howCard__aiNote muted">{t(lang, 'how.s1Ai')}</p>
            </div>

            <div className="card">
              <div className="step">
                <div className="step__num">02</div>
                <h3 className="h3">{t(lang, 'how.s2Title')}</h3>
              </div>
              <p className="p">{t(lang, 'how.s2P')}</p>
            </div>

            <div className="card">
              <div className="step">
                <div className="step__num">03</div>
                <h3 className="h3">{t(lang, 'how.s3Title')}</h3>
              </div>
              <p className="p">{t(lang, 'how.s3P')}</p>
            </div>
          </div>
        </section>

        <section id="features" className="section container" data-reveal>
          <div className="section__header">
            <div className="section__index">03</div>
            <div>
              <h2 className="h2">{t(lang, 'feat.h2')}</h2>
              <p className="muted">{t(lang, 'feat.muted')}</p>
            </div>
          </div>

          <div className="grid grid--2">
            <div className="card">
              <div className="feature">
                <SparkIcon className="feature__icon" />
                <h3 className="h3">{t(lang, 'feat.f1Title')}</h3>
              </div>
              <p className="p">{t(lang, 'feat.f1P')}</p>
            </div>

            <div className="card">
              <div className="feature">
                <SparkIcon className="feature__icon" />
                <h3 className="h3">{t(lang, 'feat.f2Title')}</h3>
              </div>
              <p className="p">{t(lang, 'feat.f2P')}</p>
            </div>

            <div className="card card--soft">
              <div className="feature">
                <SparkIcon className="feature__icon" />
                <h3 className="h3">{t(lang, 'feat.f3Title')}</h3>
              </div>
              <p className="p">{t(lang, 'feat.f3P')}</p>
            </div>

            <div className="card card--soft">
              <div className="feature">
                <SparkIcon className="feature__icon" />
                <h3 className="h3">{t(lang, 'feat.f4Title')}</h3>
              </div>
              <p className="p">{t(lang, 'feat.f4P')}</p>
            </div>
          </div>
        </section>

        <section id="prototypes" className="section container" data-reveal>
          <div className="section__header">
            <div className="section__index">04</div>
            <div>
              <h2 className="h2">{t(lang, 'proto.h2')}</h2>
              <p className="muted">{t(lang, 'proto.muted')}</p>
            </div>
          </div>
          <PrototypeShowcase lang={lang} />
        </section>

        <section id="live-demo" className="section container" data-reveal>
          <InteractiveScenarioDemo lang={lang} />
        </section>

        <section id="pricing" className="section container" data-reveal>
          <div className="section__header">
            <div className="section__index">06</div>
            <div>
              <h2 className="h2">{t(lang, 'price.h2')}</h2>
              <p className="muted">{t(lang, 'price.muted')}</p>
            </div>
          </div>

          <div className="grid grid--3">
            <div className="plan">
              <div className="plan__top">
                <div className="plan__name">{t(lang, 'price.free')}</div>
                <div className="plan__price">{t(lang, 'price.soon')}</div>
              </div>
              <ul className="plan__list">
                <li>{t(lang, 'price.freeL1')}</li>
                <li>{t(lang, 'price.freeL2')}</li>
                <li>{t(lang, 'price.freeL3')}</li>
              </ul>
              <a className="btn btn--ghost btn--full" href="#" onClick={(e) => e.preventDefault()}>
                {t(lang, 'price.join')}
              </a>
            </div>

            <div className="plan plan--featured">
              <div className="plan__top">
                <div className="plan__name">{t(lang, 'price.plus')}</div>
                <div className="plan__price">{t(lang, 'price.soon')}</div>
              </div>
              <ul className="plan__list">
                <li>{t(lang, 'price.plusL1')}</li>
                <li>{t(lang, 'price.plusL2')}</li>
                <li>{t(lang, 'price.plusL3')}</li>
              </ul>
              <a className="btn btn--primary btn--full" href="#" onClick={(e) => e.preventDefault()}>
                {t(lang, 'hero.download')} <span className="btn__tag">{t(lang, 'price.soonTag')}</span>
              </a>
            </div>

            <div className="plan">
              <div className="plan__top">
                <div className="plan__name">{t(lang, 'price.pro')}</div>
                <div className="plan__price">{t(lang, 'price.soon')}</div>
              </div>
              <ul className="plan__list">
                <li>{t(lang, 'price.proL1')}</li>
                <li>{t(lang, 'price.proL2')}</li>
                <li>{t(lang, 'price.proL3')}</li>
              </ul>
              <a className="btn btn--ghost btn--full" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                {t(lang, 'price.partner')}
              </a>
            </div>
          </div>

          <div className="callout">
            <div className="callout__title">{t(lang, 'price.callTitle')}</div>
            <div className="callout__body">{t(lang, 'price.callBody')}</div>
            <a className="btn btn--ghost" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
              {t(lang, 'price.callCta')}
            </a>
          </div>
        </section>

        <section id="contact" className="section container" data-reveal>
          <div className="section__header">
            <div className="section__index">07</div>
            <div>
              <h2 className="h2">{t(lang, 'contact.h2')}</h2>
              <p className="muted">{t(lang, 'contact.muted')}</p>
            </div>
          </div>

          <div className="grid grid--2">
            <div className="card contactCard contactCard--salma">
              <h3 className="h3">Salma</h3>
              <p className="contactCard__credential muted">{t(lang, 'contact.credentialSalma')}</p>
              <p className="contactCard__role muted">{t(lang, 'contact.roleSalma')}</p>
              <div className="contactCard__bio">
                <p className="p muted">{t(lang, 'contact.salmaBio')}</p>
              </div>
              <a
                className="contactCard__linkedin"
                href={SALMA_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(lang, 'a11y.contactLinkedInSalma')}
              >
                <LinkedInIcon />
                <span>{t(lang, 'hero.linkedin')}</span>
              </a>
            </div>

            <div className="card card--soft contactCard contactCard--jewels">
              <h3 className="h3">Jewels</h3>
              <p className="contactCard__credential muted">{t(lang, 'contact.credentialJewels')}</p>
              <p className="contactCard__role muted">{t(lang, 'contact.roleJewels')}</p>
              <div className="contactCard__bio">
                <p className="p muted">{t(lang, 'contact.jewelsBio1')}</p>
                <p className="p muted">{t(lang, 'contact.jewelsBio2')}</p>
              </div>
              <a
                className="contactCard__linkedin"
                href={JEWELS_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(lang, 'a11y.contactLinkedInJewels')}
              >
                <LinkedInIcon />
                <span>{t(lang, 'hero.linkedin')}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__left">
            <div className="footer__brand">
              <span className="brand__mark" aria-hidden="true">
                <SparkIcon />
              </span>
              <span className="brand__name">DialaGO</span>
            </div>
            <div className="footer__meta">
              © {new Date().getFullYear()} dialago.com · {t(lang, 'footer.rights')}
            </div>
          </div>
          <div className="footer__right">
            <a className="footer__link" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
              {t(lang, 'hero.linkedin')}
            </a>
            <button className="footer__link" type="button" onClick={() => scrollToId('top')}>
              {t(lang, 'footer.backTop')}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

