import React from 'react';

const FormGrid = ({ children, cols = 2 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-6`}>
    {children}
  </div>
);
export default FormGrid;