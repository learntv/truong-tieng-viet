export function FlagImg({ code, size = 24 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      // The 40px file is soft on high-density screens and at the larger sizes.
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      width={size}
      height={size * 0.75}
      alt={code}
      className="block object-cover"
    />
  );
}
