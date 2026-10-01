import { clsx } from 'clsx';

type LogoVariant = 'full' | 'symbol' | 'wordmark';

interface LogoProps {
  size?: number;
  variant?: LogoVariant;
  className?: string;
  'aria-label'?: string;
  onClick?: () => void;
}

const LOGO_SRC = '/logo.png';

export function Logo({
  size = 40,
  variant = 'full',
  className = '',
  'aria-label': ariaLabel = 'EcoScan logo',
  onClick,
}: LogoProps) {
  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    flexShrink: 0,
    overflow: 'hidden',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: onClick ? 'pointer' : 'default',
  };

  if (variant === 'symbol') {
    return (
      <div
        className={clsx('inline-flex items-center', className)}
        role="img"
        aria-label={ariaLabel}
        style={{ width: size, height: size }}
        onClick={onClick}
      >
        <img
          src={LOGO_SRC}
          alt=""
          aria-hidden="true"
          style={{
            width: size * 3,
            height: size * 3,
            objectFit: 'none',
            objectPosition: 'left center',
            transform: `translateX(-${size * 0.15}px)`,
          }}
        />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div
        className={clsx('inline-flex items-center', className)}
        role="img"
        aria-label={ariaLabel}
        style={{ height: size }}
        onClick={onClick}
      >
        <img
          src={LOGO_SRC}
          alt=""
          aria-hidden="true"
          style={{
            height: size * 2.5,
            width: 'auto',
            objectFit: 'none',
            objectPosition: 'center center',
            transform: 'translateX(-10%)',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx('inline-flex items-center', className)}
      role="img"
      aria-label={ariaLabel}
      style={wrapperStyle}
      onClick={onClick}
    >
      <div style={containerStyle}>
        <img
          src={LOGO_SRC}
          alt=""
          aria-hidden="true"
          style={imageStyle}
        />
      </div>
    </div>
  );
}

export default Logo;