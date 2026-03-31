import React, { useState } from 'react';

export default function RelicIcon({ src, name, className = "relic-icon" }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`${className} relic-fallback`} title={name}>
        {name[0].toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
