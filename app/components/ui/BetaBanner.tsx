import { FC, useEffect, useState } from "react";
import { X } from "lucide-react";

const BetaBanner: FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isBannerDismissed = localStorage.getItem("betaBannerDismissed");
    if (isBannerDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("betaBannerDismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white py-2 relative">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium">
        Free access during our beta period! Start collecting your reading
        insights today.
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BetaBanner;
