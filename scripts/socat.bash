#!/bin/bash
. .env
if mkcert $FT_DOCS_HOST
then
    CERT=./$FT_DOCS_HOST.pem KEY=$FT_DOCS_HOST-key.pem
    socat openssl-listen:7733,cert=$CERT,key=$KEY,verify=0,reuseaddr,fork tcp:localhost:8881
fi
