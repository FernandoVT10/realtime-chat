import classNames from "classnames";

interface SpinnerProps {
  size: number;
  className?: string;
}

function Spinner({ size, className }: SpinnerProps) {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    borderWidth: `${size / 10}px`,
  };

  const spinnerClass = classNames(className, "spinner");

  return (
    <span className={spinnerClass} style={style}></span>
 );
}

export default Spinner;
