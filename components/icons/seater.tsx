import React from 'react';

const Seater = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
     <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M10 3.628a3.333 3.333 0 1 1 0 4.41m2.5 9.462h-10v-.833a5 5 0 1 1 10 0v.833Zm0 0h5v-.833a5 5 0 0 0-7.5-4.331m.833-6.503a3.333 3.333 0 1 1-6.666 0 3.333 3.333 0 0 1 6.666 0Z"
    />
  </svg>
);

export default Seater;
