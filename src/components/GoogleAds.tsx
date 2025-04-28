
import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  client: string; // Your Google AdSense client ID
  slot: string;   // Ad unit ID
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
}

const GoogleAd: React.FC<GoogleAdProps> = ({
  client,
  slot,
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
}) => {
  useEffect(() => {
    // Push the ad to Google's ad service when component mounts
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("Error pushing ad to Google AdSense:", error);
    }
  }, []);

  return (
    <div className="google-ad-container my-4">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

// Component for horizontal ad unit
export const HorizontalAd: React.FC = () => (
  <GoogleAd
    client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense Publisher ID
    slot="XXXXXXXXXX" // Replace with your Ad Unit ID
    format="horizontal"
    style={{ display: 'block', textAlign: 'center' }}
  />
);

// Component for responsive ad unit
export const ResponsiveAd: React.FC = () => (
  <GoogleAd
    client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense Publisher ID
    slot="XXXXXXXXXX" // Replace with your Ad Unit ID
    responsive={true}
    style={{ display: 'block' }}
  />
);

// Component to initialize Google AdSense
export const GoogleAdsInit: React.FC = () => {
  useEffect(() => {
    // Add Google AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"; // Replace with your AdSense Publisher ID
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup if needed
      try {
        document.head.removeChild(script);
      } catch (e) {
        console.error("Error removing AdSense script:", e);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default GoogleAd;
