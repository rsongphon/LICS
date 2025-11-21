import logging
import paho.mqtt.client as mqtt
from app.core.config import settings

logger = logging.getLogger(__name__)

class MQTTClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MQTTClient, cls).__new__(cls)
            cls._instance.client = None
        return cls._instance

    def __init__(self):
        if self.client is None:
            self.client = mqtt.Client()
            self.client.on_connect = self.on_connect
            self.client.on_disconnect = self.on_disconnect
            # Set username/password if configured
            if settings.MQTT_USERNAME and settings.MQTT_PASSWORD:
                self.client.username_pw_set(settings.MQTT_USERNAME, settings.MQTT_PASSWORD)

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info("Connected to MQTT broker")
        else:
            logger.error(f"Failed to connect to MQTT broker with code: {rc}")

    def on_disconnect(self, client, userdata, rc):
        if rc != 0:
            logger.warning("Unexpected disconnection from MQTT broker")

    def start(self):
        try:
            logger.info(f"Connecting to MQTT broker at {settings.MQTT_BROKER}:{settings.MQTT_PORT}...")
            self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
            self.client.loop_start()
        except Exception as e:
            logger.error(f"Could not connect to MQTT broker: {e}")

    def stop(self):
        if self.client:
            self.client.loop_stop()
            self.client.disconnect()
            logger.info("Disconnected from MQTT broker")

    def publish(self, topic: str, payload: str):
        if self.client:
            return self.client.publish(topic, payload)
        else:
            logger.warning("MQTT client not initialized, cannot publish")

    def subscribe(self, topic: str, callback):
        if self.client:
            self.client.subscribe(topic)
            self.client.message_callback_add(topic, callback)
            logger.info(f"Subscribed to {topic}")
        else:
            logger.warning("MQTT client not initialized, cannot subscribe")

mqtt_client = MQTTClient()
