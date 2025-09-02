import React, { useEffect, useRef } from 'react';

const ScrollReveal = ({
  as: Tag = 'div',
  className = '',
  children,
  delay = 0,
  duration = 450,
  y = 16,
  threshold = 0.12,
  ...rest
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = `translateY(${y}px)`;
    el.style.willChange = 'opacity, transform';

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            const id = setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, delay);
            io.unobserve(el);
            return () => clearTimeout(id);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay, duration, y, threshold]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
};

export default ScrollReveal;
