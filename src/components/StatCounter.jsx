import React, { useState, useEffect } from 'react';
import { useInView } from './utils/useInView';

const StatCounter = ({ value, label }) => {
    const [count, setCount] = useState(0);
    const [ref, isInView] = useInView({ threshold: 0.1 });

    const parts = value.match(/([€$]*)(\d+)(.*)/) || [null, '', value, ''];
    const prefix = parts[1] || '';
    const target = parseInt(parts[2], 10);
    const suffix = parts[3] || '';

    const duration = 2000;
    useEffect(() => {
        if (isInView) {
            let start = null;

            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);

                const easedProgress = progress * (2 - progress);

                setCount(Math.floor(easedProgress * target));

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    setCount(target);
                }
            };

            window.requestAnimationFrame(step);
        }
    }, [isInView, target]);

    return (
        <div
            ref={ref}
            className="bg-white text-primary p-8 text-center flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-gray-200"
        >
            <p className="text-7xl font-extrabold">
                {prefix}{count}{suffix}
            </p>
            <p className="mt-2 font-semibold text-m-primary leading-tight">{label}</p>
        </div>
    );
};

export default StatCounter;