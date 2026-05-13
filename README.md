# Decision Support Navigator

Static landing page for the SDSN Global Climate Hub Decision Support Navigator.

## File layout

```
Decision Support Navigator.html   ← bundled, self-contained deploy artifact
index.src.html                    ← source entry (links to styles/ and scripts/)
styles/                           ← split CSS modules
scripts/                          ← split JS modules
assets/                           ← logos (gch, sdsn, aris)
Dockerfile, nginx.conf            ← container deploy
```

Edit the source files, then re-bundle into `Decision Support Navigator.html`
(any HTML inliner that handles `<link>` and `<script src>` will work).

## Run locally

Any static server works:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080/Decision%20Support%20Navigator.html
```

## Deploy with Docker

```bash
docker build -t gch-navigator .
docker run --rm -p 8080:80 gch-navigator
# open http://localhost:8080
```

The container serves the bundled HTML at `/` and also ships the modular
source under `/src/` for inspection.

## Push to a registry

```bash
docker tag gch-navigator <registry>/<org>/gch-navigator:latest
docker push <registry>/<org>/gch-navigator:latest
```

## Deploy to common hosts

- **Fly.io:** `fly launch --dockerfile Dockerfile`
- **Railway:** detect Dockerfile automatically; set service to port 80.
- **Render:** create a Web Service, runtime = Docker, port = 80.
- **Cloud Run:** `gcloud run deploy gch-navigator --source .` (port 80).
