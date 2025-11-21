import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


from contextlib import asynccontextmanager
from app.core.mqtt import mqtt_client

from app.core.mqtt_topics import MQTTTopics
import logging

logger = logging.getLogger(__name__)

def log_mqtt_message(client, userdata, message):
    logger.info(f"Received message on {message.topic}: {message.payload.decode()}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    mqtt_client.start()
    mqtt_client.subscribe(MQTTTopics.ALL_DEVICE_STATUS, log_mqtt_message)
    yield
    mqtt_client.stop()


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    lifespan=lifespan,
)

# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)
