# utils/network.py
import socket
import os
from dotenv import load_dotenv


def LOAD_ENV(BASE_DIR):
    load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)
    env_type = os.environ.get("ENV")
    if os.environ.get("RUNNING_IN_DOCKER") == "1":
        load_dotenv(os.path.join(BASE_DIR, ".env.docker"), override=True)
    elif env_type == "lan":
        load_dotenv(os.path.join(BASE_DIR, ".env.lan"), override=True)
        local_ip = get_local_ip()
        os.environ["LOCAL_IP"] = local_ip
        os.environ["ALLOWED_HOSTS"] = f"{GET_ENV('ALLOWED_HOSTS','')},{local_ip}"
        os.environ["ALLOWED_ORIGINS"] = (
            f"{GET_ENV('ALLOWED_ORIGINS','')},"
            f"http://{local_ip}:3000,http://{local_ip}:5173"
        )
    elif env_type == "rpi":
        load_dotenv(os.path.join(BASE_DIR, ".env.rpi"), override=True)
    elif env_type == "production":
        load_dotenv(os.path.join(BASE_DIR, ".env.prod"), override=True)
    else:
        load_dotenv(os.path.join(BASE_DIR, ".env.local"), override=True)


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't have to be reachable
        s.connect(("10.255.255.255", 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = "127.0.0.1"
    finally:
        s.close()
    return IP


def GET_ENV_LIST(key: str) -> list[str]:
    raw = os.environ.get(key, "")
    return [item.strip() for item in raw.split(",") if item.strip()]


def GET_ENV(key: str, default: str = "") -> str:
    raw = os.environ.get(key, default)
    return raw.strip()


def GET_BOOL(key: str, default: str = "False") -> bool:
    val = os.environ.get(key, default).lower()
    return val in ("true", "1", "yes")
