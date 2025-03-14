import { SVGProps } from "react";
const MenuCloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        fill="current"
        d="m19.41 18 8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1.004 1.004 0 0 0-1.42 1.42l8.3 8.29-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29 8.29 8.29a1 1 0 0 0 1.41-1.41L19.41 18Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="current" d="M0 0h36v36H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default MenuCloseIcon;
