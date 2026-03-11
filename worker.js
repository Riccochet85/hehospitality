export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let key = url.pathname.replace(/^\/+/, ""); // remove leading slash

    // Default file if root is requested
    if (key === "") key = "hehospitalityconsulting_privacystatement.html";

    // Try to fetch the object from R2
    const object = await env.PICTURE.get(key);

    if (!object) {
      return new Response("Not found", { status: 404 });
    }

    // Detect MIME type
    const mimeType = {
      "png": "image/png",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "webp": "image/webp",
      "svg": "image/svg+xml",
      "gif": "image/gif",
      "ico": "image/x-icon",
      "wmf": "image/x-wmf",
      "html": "text/html; charset=utf-8",
      "css": "text/css",
      "js": "application/javascript"
    };

    const ext = key.split(".").pop().toLowerCase();
    const contentType = mimeType[ext] || "application/octet-stream";

    return new Response(object.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  }
};

