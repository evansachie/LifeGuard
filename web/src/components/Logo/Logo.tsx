import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const Logo = ({ className = 'logo', width, height }: LogoProps) => {
  return (
    <Link to="/">
      <img
        src="/images/lifeguard-2.svg"
        alt="lifeguard logo"
        className={className}
        style={{
          width: width ? width : 'auto',
          height: height ? height : 'auto',
        }}
      />
    </Link>
  );
};

export default Logo;
