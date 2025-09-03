import React from 'react';

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="m9 12 2 2 4-4M7.835 4.697A3.42 3.42 0 0 0 9.78 3.89a3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.807 3.42 3.42 0 0 1 3.138 3.137 3.42 3.42 0 0 0 .806 1.947 3.42 3.42 0 0 1 0 4.437 3.42 3.42 0 0 0-.806 1.947 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.947 3.42 3.42 0 0 1 0-4.437 3.42 3.42 0 0 0 .806-1.947 3.42 3.42 0 0 1 3.138-3.137Z"
    />
  </svg>
);

export default CheckIcon;
