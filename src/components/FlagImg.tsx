export function FlagImg({ code, size = 24 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      width={size}
      height={size * 0.75}
      alt={code}
      className="block object-cover"
    />
  );
}
