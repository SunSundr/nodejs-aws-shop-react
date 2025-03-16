import React, { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  index: number;
  style?: React.CSSProperties;
}

const ProductImage: React.FC<ImageWithFallbackProps> = ({ src, alt, index, style }) => {
  const [isLoading, setIsLoading] = useState(true);
  const randomImagePath = `https://picsum.photos/1792/1024?random=${index}`;
  const isrc = src || randomImagePath;
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [error, setError] = useState(false);
  const offsetFix = '-12px';

  useEffect(() => {
    const img = new Image();
    img.src = isrc;
    img.onload = () => {
      setIsLoading(false);
      setImageSrc(isrc);
    };
    img.onerror = () => {
      if (error) return;
      setIsLoading(false);
      setImageSrc(randomImagePath);
      setError(true);
    };
  }, [src, randomImagePath]);

  return (
    <div style={{ ...style }}>
      {isLoading && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height="100%"
          sx={{
            aspectRatio: 1.75,
            mb: offsetFix,
          }}
        />
      )}
      <img
        style={{
          aspectRatio: 1.75,
          width: isLoading ? 0 : '100%',
          height: isLoading ? 0 : '100%',
          minHeight: isLoading ? 0 : 'calc(100% / 1.75)',
          objectFit: 'cover',
          objectPosition: 'center',
          transition: 'opacity 0.7s ease-in-out',
          opacity: isLoading ? 0 : 1,
          marginBottom: isLoading ? offsetFix : 0,
          pointerEvents: 'none',
        }}
        alt={alt}
        src={imageSrc}
      />
    </div>
  );
};

export default ProductImage;
