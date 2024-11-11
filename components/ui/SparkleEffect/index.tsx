import { useState, useEffect } from "react";

interface SparkleProps {
  width?: number;
  height?: number;
  density?: number;
  baseSize?: number;
}

export default function SparkleEffect({
  width = 800,
  height = 800,
  density = 350,
  baseSize = 2,
}: SparkleProps) {
  const colors = ["#F4A95C", "#F8D684", "#F8D684"];

  // Fixed reference size for consistent scaling
  const REFERENCE_SIZE = 600;
  const scaleFactor = Math.min(width, height) / REFERENCE_SIZE;

  const [stars, setStars] = useState<
    Array<{
      id: number;
      size: number;
      duration: number;
      delay: number;
      endX: number;
      endY: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    const newStars = Array(density)
      .fill(null)
      .map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = (100 + Math.random() * 200) * scaleFactor;
        const sizeMultiplier = 1 + Math.random();

        return {
          id: i,
          size: (baseSize + Math.random() * 6.5) * sizeMultiplier * scaleFactor,
          duration: 1 + Math.random() * 2,
          delay: Math.random() * 2,
          endX: Math.cos(angle) * distance,
          endY: Math.sin(angle) * distance,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });
    setStars(newStars);
  }, [density, baseSize, width, height, scaleFactor]);

  const starPath =
    "M56.8921 41.0942C80.7236 41.707 99 45.2368 99 49.5C99 53.7632 80.7236 57.293 56.8921 57.9058C56.2871 81.2402 53.208 99 49.5 99C45.792 99 42.7129 81.2402 42.1079 57.9058C18.2764 57.293 0 53.7632 0 49.5C0 45.2368 18.2764 41.707 42.1079 41.0942C42.7129 17.7598 45.792 0 49.5 0C53.208 0 56.2871 17.7598 56.8921 41.0942Z";

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {stars.map((star) => {
            const scale = star.size / (45 * scaleFactor);
            const startDelay = 0.1;

            return (
              <g key={star.id}>
                <path
                  d={starPath}
                  fill={star.color}
                  transform={`translate(${-49.5}, ${-49.5})`}
                >
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0,0"
                    to={`${star.endX},${star.endY}`}
                    dur={`${star.duration}s`}
                    begin={`${star.delay + startDelay}s`}
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="scale"
                    values={`0.0001;${scale};0`}
                    dur={`${star.duration}s`}
                    begin={`${star.delay + startDelay}s`}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur={`${star.duration}s`}
                    begin={`${star.delay + startDelay}s`}
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
