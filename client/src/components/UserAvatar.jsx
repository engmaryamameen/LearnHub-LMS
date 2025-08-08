import React, { useState } from 'react';
import { assets } from '../assets/assets';

const UserAvatar = ({ 
  src, 
  alt = "User", 
  className = "w-9 h-9 rounded-full",
  fallbackImages = [
    assets.profile_img,
    assets.profile_img2,
    assets.profile_img3,
    assets.profile_img_1,
    assets.profile_img_2,
    assets.profile_img_3,
    assets.user_icon
  ]
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (currentImageIndex < fallbackImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setHasError(true);
    }
  };

  const getImageSrc = () => {
    if (hasError) {
      return fallbackImages[fallbackImages.length - 1]; // Use the last fallback (user_icon)
    }
    
    if (currentImageIndex === 0 && src) {
      return src; // Use the original source first
    }
    
    return fallbackImages[currentImageIndex] || fallbackImages[fallbackImages.length - 1];
  };

  return (
    <img 
      src={getImageSrc()}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
};

export default UserAvatar; 