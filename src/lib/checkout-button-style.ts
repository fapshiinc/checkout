/** Pick white or near-black label on merchant primary for readable CTA. */
export function checkoutPayButtonStyle(primaryColor: string): {
  background: string;
  color: string;
} {
  const bg = primaryColor.trim() || "#111111";
  if (bg.startsWith("#") && (bg.length === 7 || bg.length === 4)) {
    const hex =
      bg.length === 4
        ? `#${bg[1]}${bg[1]}${bg[2]}${bg[2]}${bg[3]}${bg[3]}`
        : bg;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return { background: bg, color: luminance > 0.62 ? "#111111" : "#ffffff" };
  }
  return { background: bg, color: "#ffffff" };
}
