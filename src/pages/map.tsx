// src/pages/map.tsx
'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const DynamicMapSystem = dynamic(
  () => import('@/components/MapComponent').then((mod) => mod.default),
  { ssr: false }
);

const MapPage: React.FC = () => {
  
  return <DynamicMapSystem />;
};

export default MapPage;