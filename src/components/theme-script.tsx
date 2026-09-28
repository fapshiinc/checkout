export function ThemeScript() {
  const script = `
(function () {
  try {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
    var path = location.pathname || "";
    if (path === "/preview" && location.search.indexOf("embed=1") !== -1) {
      document.documentElement.classList.add("checkout-preview-embed");
    }
  } catch (e) {}
})();
`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
