import http.server
import socketserver
import os
import urllib.parse
import mimetypes

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

mimetypes.add_type("application/javascript", ".mjs")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("video/mp4", ".mp4")

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def _handle_redirects(self):
        url = urllib.parse.urlparse(self.path)
        clean_path = url.path.rstrip('/')
        
        # Exact Netlify redirects
        if clean_path in ('/home', '/index', '/index.html'):
            self.send_response(301)
            self.send_header('Location', '/' + (('?' + url.query) if url.query else ''))
            self.end_headers()
            return True
        elif clean_path == '/about':
            self.send_response(301)
            self.send_header('Location', '/#about' + (('?' + url.query) if url.query else ''))
            self.end_headers()
            return True
        elif clean_path == '/contact':
            self.send_response(301)
            self.send_header('Location', '/#contact' + (('?' + url.query) if url.query else ''))
            self.end_headers()
            return True
        elif clean_path == '/works':
            self.send_response(301)
            self.send_header('Location', '/#works' + (('?' + url.query) if url.query else ''))
            self.end_headers()
            return True

        fs_path = self.translate_path(self.path)
        if not os.path.exists(fs_path):
            if os.path.exists(fs_path + '/index.html') or os.path.isdir(fs_path):
                self.send_response(301)
                self.send_header('Location', url.path + '/' + (('?' + url.query) if url.query else ''))
                self.end_headers()
                return True
            # Fallback to index.html for SPA routes without extension
            if not os.path.splitext(clean_path)[1]:
                self.path = '/'
        return False

    def do_GET(self):
        if self._handle_redirects():
            return
        super().do_GET()

    def do_HEAD(self):
        if self._handle_redirects():
            return
        super().do_HEAD()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Server started at http://localhost:{PORT}")
        httpd.serve_forever()
