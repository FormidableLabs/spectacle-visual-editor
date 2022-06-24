import React, { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  size?: number;
}

const TransSVG = ({ size = 18, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 5 5"
    {...props}
  >
    <path stroke="#EDEDED" fill="#EDEDED" d="M0 0h5v5H0z" />
    <path
      d="M0 0v5h1V0zm2 0v5h1V0zm2 0v5h1V0zM0 0h5v1H0zm0 2h5v1H0zm0 2h5v1H0z"
      fill="#fff"
      fillRule="evenodd"
    />
  </svg>
);

export default TransSVG;
