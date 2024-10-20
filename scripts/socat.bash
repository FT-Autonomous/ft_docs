#!/bin/bash
. .env

CERT=./$FT_DOCS_HOST.pem
KEY=$FT_DOCS_HOST-key.pem

if [[ ! -e $CERT || ! -e $KEY ]]
then
    mkcert $FT_DOCS_HOST || exit 1
else
    echo Using existing certs
fi

socat openssl-listen:7733,cert=$CERT,key=$KEY,verify=0,reuseaddr,fork tcp:localhost:8881
