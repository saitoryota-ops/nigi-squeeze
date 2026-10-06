"""開発用の静的サーバー（スマホ確認用に LAN からも見える）。

python -m http.server は待ち行列が5しかなく、画像を一度にたくさん読むと
接続がリセットされる（ERR_CONNECTION_RESET）ので、スレッド＋大きめの待ち行列にしている。
  python serve.py [port]
"""
import os, socket, sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class Server(ThreadingHTTPServer):
    # IPv6/IPv4 の両方で待つ（localhost が ::1 に解決されても待たされないように）
    address_family = socket.AF_INET6
    request_queue_size = 128
    daemon_threads = True

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except OSError:
            pass
        super().server_bind()


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # 開発中は毎回最新を読む
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8884
    root = os.path.dirname(os.path.abspath(__file__))
    srv = Server(("::", port), partial(Handler, directory=root))
    print(f"serving {root} on :{port}", flush=True)
    srv.serve_forever()
