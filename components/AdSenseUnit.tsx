
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSenseUnitProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
  isResponsive?: boolean;
}

const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  adClient,
  adSlot,
  adFormat = 'auto',
  style = { display: 'block' },
  className = '',
  isResponsive = true,
}) => {
  const adInsRef = useRef<HTMLModElement>(null); // HTMLModElement is type for <ins>
  const [adPushedForCurrentSlot, setAdPushedForCurrentSlot] = useState(false);

  // Reset adPushedForCurrentSlot if adClient or adSlot changes, to allow a new push for the new configuration.
  useEffect(() => {
    setAdPushedForCurrentSlot(false);
  }, [adClient, adSlot]);

  useEffect(() => {
    if (adClient && adSlot && adSlot !== 'YOUR_AD_SLOT_ID_HERE' && !adPushedForCurrentSlot) {
      const insElement = adInsRef.current;
      if (insElement) {
        // Heuristic: Check if AdSense has already modified this <ins> tag.
        // Common signs: presence of an iframe as a child or a 'data-ad-status' attribute.
        const alreadyProcessed = insElement.querySelector('iframe') || insElement.getAttribute('data-ad-status');

        if (!alreadyProcessed) {
          try {
            if (window.adsbygoogle) {
              console.log(`Attempting to push ad for slot: ${adSlot}`);
              window.adsbygoogle.push({});
              setAdPushedForCurrentSlot(true); 
            } else {
              console.warn(`AdSense script (adsbygoogle) not loaded yet for slot: ${adSlot}. Ad will not display now.`);
              // Consider a timeout or event listener for when adsbygoogle loads if this is a common scenario.
            }
          } catch (e: any) {
            console.error(`AdSense push error for slot ${adSlot}: ${e.message}`);
            // For any error during push, mark as pushed to prevent rapid retries for this slot.
            setAdPushedForCurrentSlot(true); 
          }
        } else {
          console.log(`Ad slot ${adSlot} detected as already processed or has content. No new push needed.`);
          setAdPushedForCurrentSlot(true); // Mark as processed
        }
      }
    }
  }, [adClient, adSlot, adPushedForCurrentSlot]); // Effect runs if these change

  if (!adClient || !adSlot || adSlot === 'YOUR_AD_SLOT_ID_HERE') {
    return (
      <div className={`bg-gray-700 text-gray-400 p-4 rounded-md text-center ${className}`} style={style}>
        <p>Advertisement Area</p>
        {adSlot === 'YOUR_AD_SLOT_ID_HERE' && <p className="text-xs mt-1">(Ad slot ID needs to be configured for live ads)</p>}
      </div>
    );
  }

  return (
    <div className={className || 'flex justify-center items-center w-full'}>
      <ins
        ref={adInsRef}
        key={`${adClient}-${adSlot}`} // Key to help React manage the <ins> element lifecycle
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={isResponsive ? "true" : "false"}
      ></ins>
    </div>
  );
};

export default AdSenseUnit;
