import time
from collections import defaultdict
from fastapi import Request, HTTPException, status

class SimpleRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    def check(self, request: Request, custom_key: str = ""):
        # Get client IP (support Cloudflare / proxy headers)
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "unknown"
            
        key = f"{ip}:{custom_key}"
        now = time.time()
        
        # Clean older requests outside the sliding window
        self.requests[key] = [t for t in self.requests[key] if now - t < self.window_seconds]
        
        if len(self.requests[key]) >= self.max_requests:
            retry_after = int(self.window_seconds - (now - self.requests[key][0]))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many requests. Please try again in {max(1, retry_after)} seconds.",
                headers={"Retry-After": str(max(1, retry_after))}
            )
            
        self.requests[key].append(now)

# Max 5 login attempts per minute per IP
login_limiter = SimpleRateLimiter(max_requests=5, window_seconds=60)

# Max 5 contact form submissions per 10 minutes per IP
contact_limiter = SimpleRateLimiter(max_requests=5, window_seconds=600)
