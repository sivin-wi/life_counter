import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useEffect, CSSProperties } from 'react';

// NumberProps: Type for the props passed to the Number component
interface NumberProps {
  mv: MotionValue<number>; // mv is a MotionValue of number
  number: number; // number is a digit (0-9)
  height: number; // height is a number representing the height of the component
}

const Number: React.FC<NumberProps> = ({ mv, number, height }) => {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  const style: CSSProperties = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return <motion.span style={{ ...style, y }}>{number}</motion.span>;
};

interface DigitProps {
  place: number; // place value (100, 10, 1, etc.)
  value: number; // the total value to be displayed
  height: number; // height of each digit container
  digitStyle?: React.CSSProperties; // optional custom styles for the digit
}

const Digit: React.FC<DigitProps> = ({ place, value, height, digitStyle }) => {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  const defaultStyle: CSSProperties = {
    height,
    position: 'relative' as const,
    width: '1ch',
    fontVariantNumeric: 'tabular-nums',
  };

  return (
    <div style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
};

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: number[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: number;
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
}

const Counter: React.FC<CounterProps> = ({
  value,
  fontSize = 100,
  padding = 0,
  places = [100, 10, 1],
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = 'white',
  fontWeight = 'bold',
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 16,
  gradientFrom = 'black',
  gradientTo = 'transparent',
  topGradientStyle,
  bottomGradientStyle,
}) => {
  const height = fontSize + padding;

  const defaultContainerStyle: CSSProperties = {
    position: 'relative' as const,
    display: 'inline-block',
  };

  const defaultCounterStyle: CSSProperties = {
    fontSize,
    display: 'flex',
    gap: gap,
    overflow: 'hidden',
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    color: textColor,
    fontWeight: fontWeight,
  };

  const gradientContainerStyle: CSSProperties = {
    pointerEvents: 'none' as const,
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  const defaultTopGradientStyle: CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
  };

  const defaultBottomGradientStyle: CSSProperties = {
    position: 'absolute' as const,
    bottom: 0,
    width: '100%',
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
  };

  return (
    <div style={{ ...defaultContainerStyle, ...containerStyle }}>
      <div style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place) => (
          <Digit key={place} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </div>
      <div style={gradientContainerStyle}>
        <div style={topGradientStyle ? topGradientStyle : defaultTopGradientStyle} />
        <div style={bottomGradientStyle ? bottomGradientStyle : defaultBottomGradientStyle} />
      </div>
    </div>
  );
};

export default Counter;