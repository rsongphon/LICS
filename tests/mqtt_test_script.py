import paho.mqtt.client as mqtt
import time
import json
import sys

BROKER = "localhost"
PORT = 1883
TOPIC = "devices/test-device-001/status"
PAYLOAD = {"status": "online", "battery": 85, "timestamp": time.time()}

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    # Publish a message
    print(f"Publishing to {TOPIC}...")
    client.publish(TOPIC, json.dumps(PAYLOAD))
    print("Message published.")
    client.disconnect()

client = mqtt.Client()
client.on_connect = on_connect

print(f"Connecting to {BROKER}:{PORT}...")
try:
    client.connect(BROKER, PORT, 60)
    client.loop_forever()
except Exception as e:
    print(f"Failed to connect: {e}")
    sys.exit(1)
