export function renderHtml(renderedComponent: string, data: unknown): string {
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
  <script id="__DATA__" type="application/json">
#{Data}
  </script>
</html>
`;
  return indexHtml.replace(/\n|  /g, "").replace("#{App}", renderedComponent).replace("#{Data}", JSON.stringify(data));
}
