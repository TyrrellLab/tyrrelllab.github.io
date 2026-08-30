# The local server

This is a static site with no build step and no dependencies. It needs only an
HTTP server that supplies this folder on port 4173.

## Start and stop

From the root folder of the repository:

```bash
python3 -m http.server 4173
```

Open <http://localhost:4173/index.html>. Keep the terminal open. To stop the
server, push `Ctrl+C`.

To start the server in the background, add `> /tmp/lab-site.log 2>&1 &`. To
stop a server that operates in the background, stop it by port:

```bash
lsof -ti :4173 | xargs kill
```

If the server continues to operate, use `kill -9`. To see the process on the
port, use `lsof -i :4173`.

Claude Code can also start the server from `.claude/launch.json`. The
configuration name is `lab-site`. `npx serve -l 4173 .` is also satisfactory.

## Make sure that the server operates

```bash
curl -I http://localhost:4173/index.html
```

The reply `HTTP/1.0 200 OK` shows that the server supplies the folder.

## Troubleshooting

- **`OSError: [Errno 48] Address already in use`.** A server is already on port
  4173. Use it, or stop it with the `lsof` command above.
- **Your changes do not show.** The preview keeps files in its cache. Do a hard
  reload with `Cmd+Shift+R`, or add `?v=2` to the URL. A version on the page
  URL does not refresh `site.css`, because the page links to that file
  separately.
- **All the pages give a 404 error.** You started the server in the incorrect
  folder. Go to the root folder of the repository first.
