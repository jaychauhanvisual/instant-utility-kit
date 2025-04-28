
import React from 'react';
import { HorizontalAd, ResponsiveAd } from './GoogleAds';

interface AdPlacementProps {
  position: 'top' | 'bottom' | 'inline' | 'sidebar';
  className?: string;
}

const AdPlacement: React.FC<AdPlacementProps> = ({ position, className }) => {
  const getAdComponent = () => {
    switch (position) {
      case 'top':
      case 'bottom':
        return <HorizontalAd />;
      case 'inline':
      case 'sidebar':
        return <ResponsiveAd />;
      default:
        return <ResponsiveAd />;
    }
  };

  return (
    <div className={`ad-container ad-${position} ${className || ''}`}>
      {getAdComponent()}
    </div>
  );
};

export default AdPlacement;
