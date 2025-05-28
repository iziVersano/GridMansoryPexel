import React from 'react';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="loading">
      <div>{message}</div>
    </div>
  );
}
