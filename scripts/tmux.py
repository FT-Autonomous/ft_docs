from subprocess import run

def kill_session(session_name: str):
    command = ["tmux", "kill-session", "-t", session_name]
    run(command)
