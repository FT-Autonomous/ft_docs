#!/bin/bash
tmux \
    new-session bash scripts/live.bash \; \
    split bash scripts/socat.bash \; \
    split python3 scripts/keep.py --port 7733 \; \
    select-layout even-vertical

