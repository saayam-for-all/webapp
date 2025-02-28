
import logging

from fastapi import FastAPI
from sample_fastapi.routers import health
from mangum import Mangum

logger = logging.getLogger("uvicorn.error")
app = FastAPI()

app.include_router(health.router)

@app.get("/")
async def root():
    logger.info("Sample FastAPI")
    return {"message": "Sample FastAPI"}

handler = Mangum(app)
