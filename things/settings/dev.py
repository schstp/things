from .base import *
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
from .secrets import SECRET_KEY

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True
# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ["localhost", "0.0.0.0", "127.0.0.1"]
