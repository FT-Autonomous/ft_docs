#!/usr/bin/env python
# Dynamic DNS configuration for docs site
from typing import Tuple, List
from subprocess import PIPE, run
from argparse import ArgumentParser
from time import sleep
from re import search
import datetime

from tmux import kill_session
from pinggy import main as spawn_new_session

def collect_relevant_sessions() -> List[Tuple[str, int, datetime.datetime]]:
    command = ["tmux", "list-sessions"]
    existing_sessions = run(command, stdout=PIPE).stdout.decode().strip()
    relevant_sessions  = []
    for existing_session in existing_sessions.split("\n"):
        matcher = search(r"(pinggy([0-9]+)):.*\(created ([^)]+)\)", existing_session)
        if matcher is not None:
            session_name, index, created_at = matcher.groups()
            created_at = datetime.datetime.strptime(created_at, "%a %b %d %H:%M:%S %Y")
            relevant_sessions.append((session_name, int(index), created_at))
    return relevant_sessions

def decide_what_to_do(
        relevant_sessions: List[Tuple[str, int, datetime.datetime]],
        port: int
):
    if len(relevant_sessions) > 1:
        print(f"Something wrong has happened, plz fix. Why are there {len(relevant_sessions)} pinggy sessions?")
        exit(1)
    elif len(relevant_sessions) == 1:
        [(session_name, index, created_at)] = relevant_sessions
        age = datetime.datetime.now() - created_at
        if age.seconds > 60 * 5:
            print(f"Going to spawn new pinggy session as {session_name} is too old")
            spawn_new_session(port=port, session_name=f"pinggy{index + 1}")
            print(f"Successfully started new session, waiting for DNS to propagate")
            sleep(30)
            print(f"Killing old session…")
            kill_session(session_name)
        else:
            print(f"Existing session {session_name} not old enough to kill")
    else:
        spawn_new_session(port=port, session_name=f"pinggy00")
        

def main(port: int):
    while True:
        decide_what_to_do(collect_relevant_sessions(), port=port)
        sleep(60)
    
if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("--port", help="this is the port that traffic inbound from the internet should flow into", required=True)
    args = parser.parse_args()
    main(port=args.port)
