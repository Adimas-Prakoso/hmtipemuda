'use client';

import dynamic from 'next/dynamic';

const RippleEffectClient = dynamic(() => import('./RippleEffect'), {
  ssr: false,
});

const MouseTrailClient = dynamic(() => import('./MouseTrail'), {
  ssr: false,
});

const ScrollProgressClient = dynamic(() => import('./ScrollProgress'), {
  ssr: false,
});

const ScrollToTopClient = dynamic(() => import('./ScrollToTop'), {
  ssr: false,
});

export default function ClientComponents() {
  return (
    <>
      <RippleEffectClient />
      <MouseTrailClient />
      <ScrollProgressClient />
      <ScrollToTopClient />
    </>
  );
}
