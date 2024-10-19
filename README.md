# Formula Trinity Autonomous Documentation

This site is built using AstroJS and MarkDoc.

## How do I edit the docs?

Generally, you will be editing markdoc files in `src/content`.

## Running

To run the dev server:

```
. .env ; npx astro dev  --port 8881 --host
```

To create a self-signed HTTPS frontend to the dev server:

```
. .env ; mkcert $FT_DOCS_HOST && CERT=./$FT_DOCS_HOST.pem KEY=$FT_DOCS_HOST-key.pem; socat openssl-listen:7733,cert=$CERT,key=$KEY,verify=0,reuseaddr,fork tcp:localhost:8881
```

To expose that server to the internet use:

```
. .env ; python3 ./scripts/pinggy.py --port 7733 && tmux attach
```

## Building the Static Site

```
FT_DOCS_FORCE_AUTH=0 npx astro build
```
