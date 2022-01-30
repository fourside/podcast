export function renderHtml(renderedComponent: string): string {
  const indexHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charSet="utf-8" />
    <title>feeder</title>
  </head>
  <body>
    <div id="root">
      #{App}
    </div>
    <script defer src="/js/client.js"></script>
  </body>
</html>
`;
  return indexHtml.replace(/\n|  /g, "").replace("#{App}", renderedComponent);
}
