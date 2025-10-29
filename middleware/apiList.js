export function listRoutes(app, res) {
  const routes = [];

  function extractRoutes(stack, prefix = '') {
    if (!stack) return; // safety check

    stack.forEach((middleware) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).map(method => method.toUpperCase());
        routes.push({
          path: prefix + middleware.route.path,
          methods: methods.join(', '),
          params: middleware.route.path.match(/:(\w+)/g) || [],
        });
      } else if (
        middleware.name === 'router' ||
        (middleware.handle && middleware.handle.stack)
      ) {
        const path = middleware.regexp ? convertRegexToPath(middleware.regexp) : '';
        // recursive call but only if stack exists
        extractRoutes(middleware.handle?.stack, prefix + path);
      }
    });
  }

  function convertRegexToPath(input) {
    const parts = String(input)
      .split('/^')
      .filter(Boolean)
      .map((part) =>
        convertString(part.replace(/\\\/\?\(\?\=\\\/\|\$\)\/i/g, '').trim())
      );
    return `/${parts.join('/')}`;
  }

  function convertString(str) {
    return String(str).slice(2);
  }

  // ✅ protect against undefined _router
  extractRoutes(app?._router?.stack);

  routes.sort((a, b) => String(a.path).localeCompare(String(b.path)));

  const grouped = [...routes].reduce((acc, item) => {
    const index = acc.findIndex((o) => o.group === extractModule(item.path));
    if (index !== -1) {
      acc[index].apiList.push(item);
    } else {
      if (extractModule(item.path)) {
        acc.push({
          group: extractModule(item.path),
          apiList: [{ ...item }],
        });
      }
    }
    return acc;
  }, []);

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>ERP API</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      table { border: 1px solid black; }
      th, td { border: 1px solid black; padding: 5px 20px; }
      body { margin: 2em; background: linear-gradient(45deg, #EE9CA7, #FFDDE1); }
      .tble-hed-stick { position: sticky; top: 0; }
      .collapse-row { display: none; }
      .expand-icon { cursor: pointer; font-size: 1.5em; font-weight: bold; }
    </style>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body class="p-3">
    <h2 class="text-dark">SMT APIs (${routes.length})</h2>
    <table class="table border display">
      <thead>
        <tr>
          <th>SNo</th>
          <th>Module</th>
          <th>Expand</th>
          <th>APIs Count</th>
        </tr>
      </thead>
      <tbody>
        ${grouped.map((group, groupIndex) => `
        <tr>
          <td>${groupIndex + 1}</td>
          <td class="text-muted fw-bold">${String(group.group).toUpperCase()}</td>
          <td class="text-center">
            <button onclick="toggleRow(${groupIndex})" id="toggleBtn${groupIndex}" class='expand-icon btn btn-light'>+</button>
          </td>
          <td class="text-muted fw-bold">${group?.apiList?.length ?? 0}</td>
        </tr>
        <tr id="collapseRow${groupIndex}" class="collapse-row" style="display: none;">
          <td colspan='4'>
            <table class="table my-3">
              <thead>
                <tr><th>SNo</th><th>Method</th><th>API</th><th>Param</th></tr>
              </thead>
              <tbody>
                ${group.apiList.map((api, apiIndex) => `
                  <tr>
                    <td>${apiIndex + 1}</td>
                    <td style="background-color: ${bg(api.methods)}">${api.methods}</td>
                    <td>${api.path}</td>
                    <td>${api.params.join(', ')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    <script>
      function toggleRow(index) {
        const collapseRow = document.getElementById("collapseRow"+index);
        const toggleBtn = document.getElementById("toggleBtn"+index);
        if (collapseRow.style.display === 'none') {
          collapseRow.style.display = 'table-row';
          toggleBtn.textContent = '-';
        } else {
          collapseRow.style.display = 'none';
          toggleBtn.textContent = '+';
        }
      }
    </script>
  </body>
  </html>
  `;

  res.setHeader("Content-Type", "text/html");
  return res.send(htmlContent);
}

function extractModule(input) {
  const match = input.match(/\/api\/(\w+)\/.*/);
  return match ? match[1] : null;
}

const bg = (method) => {
  if (method.includes("GET")) return "lightgreen";
  if (method.includes("POST")) return "skyblue";
  if (method.includes("PUT")) return "orange";
  return "#FF61D2";
};
