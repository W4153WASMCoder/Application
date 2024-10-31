// src/components/MyComponent.js
import React, { useEffect, useState } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8081/api/data')
      .then((response) => response.json())
      .then((data) => setData(data.message))
      .catch((error) => console.error('Error:', error));
  }, []);

  return <div>{data ? data : 'Loading...'}</div>;
};

export default MyComponent;
