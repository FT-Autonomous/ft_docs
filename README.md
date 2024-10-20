# Formula Trinity Autonomous Documentation

This site is built using AstroJS and MarkDoc.

## How do I edit the docs?

Generally, you will be editing markdoc files in `src/content`.

## Running

To run the dev server:

```
bash scripts/live.bash
```

To create a self-signed HTTPS frontend to the dev server:

```
bash scripts/socat.bash
```

To expose that server to the internet use:

```
. .env ; python3 ./scripts/keep.py --port 7733
```

## Building the Static Site

```
FT_DOCS_FORCE_AUTH=0 npx astro build
```
