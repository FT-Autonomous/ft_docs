#!/usr/bin/env python

# Dynamic DNS configuration for docs site

from os import environ
from socket import gethostname
from subprocess import PIPE, run, Popen
from argparse import ArgumentParser
from random import random
from time import sleep
from re import search
from requests import put, patch
from os import environ

# This is an API token with the necessary permissions. TODO: include
# permissions needed.
cloudflare_api_token         = environ["CLOUDFLARE_API_TOKEN"]
# This is the ID of your cloudflare zone, get this from the zone overview.
cloudflare_zone_id           = environ["CLOUDFLARE_ZONE_ID"]
# This is the ID of the DNS record you're creating. Get it via inspect
# element or the API.
cloudflare_target_dns_record = environ["CLOUDFLARE_TARGET_DNS_RECORD"]
# The origin ruleset.
cloudflare_ruleset_id        = environ["CLOUDFLARE_RULESET_ID"]
# The specific rule entry in cloudflare.
cloudflare_rule_id           = environ["CLOUDFLARE_RULE_ID"]

# Convert all of this code to use libtmux later: https://github.com/tmux-python/libtmux

def initiate(session_name: str, host_port=7733):
    """
    Launch a tmux session in the background with a pinggy client
    """
    command = ["tmux", "new", "-d", "-s", session_name, "ssh", "-p", "443", "-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=30", f"-R0:localhost:{host_port}", "tcp@a.pinggy.io"]
    print(" ".join(command))
    result = run(command)
    print(result)

def probe(session_name: str):
    command = ["tmux", "capture-pane", "-t", session_name, "-p"]
    output = run(command, stdout=PIPE).stdout.decode().replace("\n", "")
    host, port = search(r'tcp://(.{0,80}\.pinggy\.link):([0-9]{0,5})', output).groups()
    print(host, port)
    return host, port

def deploy(host: str, port: str):
    respoonse = put(
        f"https://api.cloudflare.com/client/v4/zones/{cloudflare_zone_id}/dns_records/{cloudflare_target_dns_record}",
        # f"http://localhost:8022/client/v4/zones/{cloudflare_zone_id}/dns_records/{cloudflare_target_dns_record}",
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {cloudflare_api_token}',
        },
        json={
            "comment": "Domain verification record",
            "name": environ["FT_DOCS_HOST"],
            "proxied": True,
            "settings": {},
            "tags": [],
            "ttl": 3600,
            "content": host,
            "type": "CNAME"
        }
    )
    
    print("DNS record change:", respoonse)

    resp = patch(
        f"https://api.cloudflare.com/client/v4/zones/{cloudflare_zone_id}/rulesets/{cloudflare_ruleset_id}/rules/{cloudflare_rule_id}",
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {cloudflare_api_token}',
        },
        json={
            "action": "route",
            "action_parameters": {
                "origin": {
                    "port": int(port)
                }
            },
            "description": "Use pinggy port",
            "enabled": True,
            "expression": "(not http.request.uri.path eq \"/z\")",
            "id": "045366467d2645a8b58f7797e1dfe06e",
            "ref": "045366467d2645a8b58f7797e1dfe06e",
        }
    )

    print("Port rewrite change:", resp)
    
def kill_session(session_name: str):
    pass

if __name__ == "__main__":
    try:
        session_name = f"pinggy{int(random()*100)}"
        print(f"Starting pinggy session with session id {session_name}")
        initiate(session_name)
        print("Waiting for pinggy session to become active")
        sleep(5)
        print("Probing pinggy session for new URL")
        host, port = probe(session_name)
        print("Deploying pinggy changes to cloudflare")
        deploy(host, port)
    except KeyboardInterrupt:
        kill_session(session_name)
