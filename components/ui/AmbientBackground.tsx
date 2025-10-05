'use client';

import * as React from 'react';

export type Theme = {
  g1: string;
  g2: string;
  g3: string;
  g4: string;
  /** color sólido opcional para un tinte muy suave del fondo */
  tint?: string;
};


type AmbientBackgroundProps = {
  theme?: Theme | null;
  visible: boolean;
};

export default function AmbientBackground({ theme, visible }: AmbientBackgroundProps) {
       const style = theme
  ? {
      ['--g1' as any]: theme.g1,
      ['--g2' as any]: theme.g2,
      ['--g3' as any]: theme.g3,
      ['--g4' as any]: theme.g4,
      opacity: visible ? 0.7 : 0,
    }
  : { opacity: 0 };
    

  return (
   <>
    <div className="ambient-bg pointer-events-none" style={style} />
    {/* capa de tinte MUY suave pero que no intercepte el mouse */}
    <div
      className="fixed inset-0 z-0 transition-opacity duration-300"
      style={{ background: theme?.tint ?? 'transparent', opacity: visible ? 0.12 : 0, pointerEvents: 'none' }}
/>

  </>
  );
}
