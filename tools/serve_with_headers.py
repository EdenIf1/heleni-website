"""Local test server: serves a folder and applies the headers from its _headers file
(Netlify / Cloudflare Pages format, '/*' block only)."""
import sys, os, http.server, functools

root = sys.argv[1]
port = int(os.environ.get("PORT") or sys.argv[2])
headers = []
with open(os.path.join(root, "_headers"), encoding="utf-8") as f:
    for line in f:
        if line.startswith("  ") and ":" in line:
            k, v = line.strip().split(":", 1)
            headers.append((k.strip(), v.strip()))

class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        for k, v in headers:
            if k == "Strict-Transport-Security":
                continue  # not meaningful on plain http localhost
            if k == "Content-Security-Policy":
                v = v.replace("; upgrade-insecure-requests", "")
            self.send_header(k, v)
        super().end_headers()

http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(H, directory=root)).serve_forever()
