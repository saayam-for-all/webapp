# Gunicorn configuration file
import multiprocessing

# Maximum number of requests a worker will process before restarting
max_requests = 1000

# Maximum jitter to add to max_requests to avoid all workers restarting at the same time
max_requests_jitter = 50

# Log file location, "-" means stdout
log_file = "-"

# The address to bind the server to
bind = "0.0.0.0:80"

# Worker timeout in seconds
timeout = 600

# Worker class to use, here it is set to use Uvicorn's worker class
worker_class = "uvicorn.workers.UvicornWorker"

# Number of worker processes for handling requests
workers = 10