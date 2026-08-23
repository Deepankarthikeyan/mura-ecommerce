/** Legacy Ekomart theme styles — load only on non-MuRa pages (via HeaderOne / checkout etc.) */
export function LegacyStyles() {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/plugins.css" />
      <link rel="stylesheet" href="/assets/css/style.css" />
    </>
  );
}
