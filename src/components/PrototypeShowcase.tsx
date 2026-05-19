import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { t, type Lang } from '../i18n';

/** Replace with your assets: drop `1.JPEG` … `4.JPEG` into `/public/prototypes/`. */
export const PROTOTYPE_IMAGE_PATHS = [
  '/prototypes/1.JPEG',
  '/prototypes/2.JPEG',
  '/prototypes/3.JPEG',
  '/prototypes/4.JPEG',
] as const;

const CARD_LABEL_KEYS = ['proto.card1', 'proto.card2', 'proto.card3', 'proto.card4'] as const;

type Props = { lang: Lang };

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PrototypeShowcase({ lang }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [broken, setBroken] = useState<Record<number, boolean>>({});
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const goPrev = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null) return i;
      return (i + PROTOTYPE_IMAGE_PATHS.length - 1) % PROTOTYPE_IMAGE_PATHS.length;
    });
  }, []);

  const goNext = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null) return i;
      return (i + 1) % PROTOTYPE_IMAGE_PATHS.length;
    });
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, close, goPrev, goNext]);

  useEffect(() => {
    if (openIndex === null) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => closeBtnRef.current?.focus());
    return () => {
      document.body.style.overflow = '';
    };
  }, [openIndex]);

  const onImgError = (idx: number) => {
    setBroken((prev) => ({ ...prev, [idx]: true }));
  };

  const modal =
    openIndex === null
      ? null
      : createPortal(
      <div
        className="protoModal is-open"
        role="dialog"
        aria-modal="true"
        aria-label={t(lang, 'a11y.protoDialog')}
      >
        <button
          type="button"
          className="protoModal__backdrop"
          aria-label={t(lang, 'a11y.closeProtoModal')}
          onClick={close}
        />
        <div className="protoModal__shell">
          <button
            ref={closeBtnRef}
            type="button"
            className="protoModal__close"
            aria-label={t(lang, 'a11y.closeProtoModal')}
            onClick={close}
          >
            <CloseIcon />
          </button>
          <div className="protoModal__row">
            <button
              type="button"
              className="protoModal__chev protoModal__chev--prev"
              onClick={goPrev}
              aria-label={t(lang, 'a11y.protoPrev')}
            >
              <ChevronLeft />
            </button>
            <div className="protoModal__frame" key={openIndex}>
              {broken[openIndex] ? (
                <div className="protoCard__fallback protoCard__fallback--large" aria-hidden="true">
                  <span className="protoCard__fallbackNum">{String(openIndex + 1).padStart(2, '0')}</span>
                  <span className="protoCard__fallbackHint">{t(lang, 'proto.fallbackHint')}</span>
                </div>
              ) : (
                <img
                  className="protoModal__img"
                  src={PROTOTYPE_IMAGE_PATHS[openIndex]}
                  alt={t(lang, CARD_LABEL_KEYS[openIndex])}
                  onError={() => onImgError(openIndex)}
                />
              )}
            </div>
            <button
              type="button"
              className="protoModal__chev protoModal__chev--next"
              onClick={goNext}
              aria-label={t(lang, 'a11y.protoNext')}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <div className="protoShowcase">
        <div className="protoShowcase__viewport" aria-label={t(lang, 'a11y.protoCarousel')}>
          <ul className="protoShowcase__track">
            {PROTOTYPE_IMAGE_PATHS.map((src, idx) => (
              <li key={src} className="protoShowcase__slide">
                <button
                  type="button"
                  className="protoCard"
                  onClick={() => setOpenIndex(idx)}
                  aria-label={`${t(lang, 'proto.open')} — ${t(lang, CARD_LABEL_KEYS[idx])}`}
                >
                  <div className="protoCard__inner">
                    {broken[idx] ? (
                      <div className="protoCard__fallback" aria-hidden="true">
                        <span className="protoCard__fallbackNum">{String(idx + 1).padStart(2, '0')}</span>
                        <span className="protoCard__fallbackHint">{t(lang, 'proto.fallbackHint')}</span>
                      </div>
                    ) : (
                      <img
                        className="protoCard__img"
                        src={src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        onError={() => onImgError(idx)}
                      />
                    )}
                  </div>
                </button>
                <div className="protoShowcase__caption muted">{t(lang, CARD_LABEL_KEYS[idx])}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {modal}
    </>
  );
}
