const HTML_ROUTES = new Map([
  ["/", "/de.html"],
  ["/de", "/de.html"],
  ["/de/", "/de.html"]
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const routedPath = HTML_ROUTES.get(url.pathname);

    if (routedPath) {
      url.pathname = routedPath;
      return env.ASSETS.fetch(new Request(url, request));
    }

    return env.ASSETS.fetch(request);
  }
};
