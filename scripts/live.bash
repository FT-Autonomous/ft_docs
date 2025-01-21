#!/bin/bash
user=$(id --user --name)
temp_base=/tmp/$RANDOM-$RANDOM$RANDOM
mkdir -p $temp_base/$user
# We want to do some minimal sandboxing to avoid some weird edge case
# where attachers can see our home directory.
bwrap \
    --dev-bind / / \
    --bind $temp_base /home \
    --bind $(realpath .) /home/naza/project \
    bash -c "cd /home/$user/project
            . .env
            npx astro preferences disable devToolbar
            npx astro telemetry disable
            FT_DOCS_FORCE_AUTH=0 npx astro dev --port 8881 --host"
