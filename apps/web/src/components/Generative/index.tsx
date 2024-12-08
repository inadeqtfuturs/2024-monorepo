'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import canvasSketch from 'canvas-sketch';
import Random from 'canvas-sketch-util/random';

import styles from './index.module.css';

Random.setSeed(Random.getRandomSeed());

const settings = {
  pixelsPerInch: 300,
  suffix: Random.getSeed(),
  styleCanvas: false,
  scaleToView: true,
  dimensions: [4, 4],
  units: 'in',
  orientation: 'landscape',
};

const sketch = ({ width, height }: { width: number; height: number }) => {
  const sliceCount = 20000;
  const slices = Array.from(new Array(sliceCount)).map((_, i, list) => {
    const t = i / Math.max(1, sliceCount - 1);

    const t2 = list.length <= 1 ? 0 : i / (list.length - 1);

    const noiseAngle = t2 * Math.PI * 2;
    const nx = Math.cos(noiseAngle);
    const ny = Math.sin(noiseAngle);

    const nf = 0.05 + Random.range(0, 0.5);
    const noise = Random.noise2D(nx * nf, ny * nf);
    const noise01 = noise * 0.75 + 0.5;

    // plot x/y coordinates along a circular path
    const r = 1.5;
    const angle = Math.PI * 2 * t;
    const x = width / 2 + Math.cos(angle) * r;
    const y = height / 2 + Math.sin(angle) * r;
    return {
      alpha: Math.abs(Random.range(0, 0.5) * (1 - noise01)),
      color: 'rgba(0, 0, 0, 0.7)',
      lineWidth: Random.range(0.005, 0.01) * 0.1,
      length: Random.gaussian() * noise01,
      angle: Random.gaussian(0, 1),
      x,
      y,
    };
  });

  return ({ context }) => {
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, width, height);

    slices.forEach((slice) => {
      context.save();
      context.beginPath();
      context.translate(slice.x, slice.y);
      context.rotate(slice.angle);
      context.lineTo(slice.length / 2, 0);
      context.lineTo(-slice.length / 2, 0);
      context.lineWidth = slice.lineWidth;
      context.strokeStyle = slice.color;
      context.globalAlpha = slice.alpha;
      context.stroke();
      context.restore();
    });
    const v = width / 2;

    const gradient = context.createRadialGradient(v, v, 0, v, v, v);
    gradient.addColorStop(0, 'rgba(249, 250, 251, 0)');
    gradient.addColorStop(1, 'rgba(249, 250, 251, 0)');
    /* gradient.addColorStop(1, '#F9FAFB'); */
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  };
};

function Generative() {
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef(null);

  console.log('@--> test', test);

  const baseSketch = useMemo(() => {
    const sliceCount = 20000;
    const slices = Array.from(new Array(sliceCount)).map((_, i, list) => {
      const t = i / Math.max(1, sliceCount - 1);

      const t2 = list.length <= 1 ? 0 : i / (list.length - 1);

      const noiseAngle = t2 * Math.PI * 2;
      const nx = Math.cos(noiseAngle);
      const ny = Math.sin(noiseAngle);

      const nf = 0.05 + Random.range(0, 0.5);
      const noise = Random.noise2D(nx * nf, ny * nf);
      const noise01 = noise * 0.75 + 0.5;

      // plot x/y coordinates along a circular path
      const r = 1.5;
      const angle = Math.PI * 2 * t;
      const x = 4 / 2 + Math.cos(angle) * r;
      const y = 4 / 2 + Math.sin(angle) * r;
      return {
        alpha: Math.abs(Random.range(0, 0.5) * (1 - noise01)),
        lineWidth: Random.range(0.005, 0.01) * 0.1,
        length: Random.gaussian() * noise01,
        angle: Random.gaussian(0, 1),
        x,
        y,
      };
    });
    return slices;
  }, []);

  useEffect(() => {
    canvasSketch(
      sketch,
      {
        ...settings,
        canvas: canvasRef.current,
      },
      [canvasRef],
    ).then(() => {
      setLoaded(true);
    });
  }, []);

  return (
    <div
      className={
        loaded
          ? `${styles.canvasWrapper} ${styles.loaded}`
          : `${styles.canvasWrapper} ${styles.loading}`
      }
    >
      <canvas
        className='canvas'
        ref={canvasRef}
        style={{ maxWidth: '100%', height: '100%' }}
      />
    </div>
  );
}

export default Generative;
