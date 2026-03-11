export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let key = url.pathname.replace(/^\/+/, "");

    // default document
    if (key === "" || key === "/") key = "hehospitalityconsultation_privacystatement.html";

    // Prevent directory traversal
    key = key.split("/").filter(Boolean).join("/");

    const object = await env.BRANDING_BUCKET.get(key);
    if (!object) {
      return new Response("Not found", { status: 404 });
    }

    const ext = key.split(".").pop().toLowerCase();
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
    const contentType = mimeMap[ext] || "application/octet-stream";

    // Cache policy: short for HTML, long for static assets
    const cacheControl = ext === "html" ? "public, max-age=300" : "public, max-age=31536000, immutable";

    return new Response(object.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": cacheControl
      }
    });
  }
};
