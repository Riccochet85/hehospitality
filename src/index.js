export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only serve the file at the root URL
    if (url.pathname !== "/") {
      return new Response("Not found", { status: 404 });
    }

    // Always serve this file
    const key = "HE_privacystatement.html";

    // Fetch from R2 using the correct binding
    const object = await env.picture.get(key);
    if (!object) {
      return new Response("Not found", { status: 404 });
    }

    // Your full MIME map preserved exactly as you wrote it
    const mimeMap = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      svg: "image/svg+xml",
      gif: "image/gif",
      ico: "image/x-icon",
      wmf: "image/x-wmf",
      html: "text/html; charset=utf-8",
      css: "text/css",
      js: "application/javascript",
      json: "application/json",
      txt: "text/plain; charset=utf-8"
    };

    const ext = key.split(".").pop().toLowerCase();
    const contentType = mimeMap[ext] || "application/octet-stream";

    const cacheControl =
      ext === "html"
        ? "public, max-age=300"
        : "public, max-age=31536000, immutable";

    return new Response(object.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": cacheControl
      }
    });
  }
};
