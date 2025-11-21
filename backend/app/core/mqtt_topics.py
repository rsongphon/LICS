class MQTTTopics:
    # Device topics
    DEVICE_COMMAND = "devices/{device_id}/command"
    DEVICE_STATUS = "devices/{device_id}/status"
    DEVICE_HEARTBEAT = "devices/{device_id}/heartbeat"
    DEVICE_DATA = "devices/{device_id}/data"
    DEVICE_LOGS = "devices/{device_id}/logs"

    # Wildcards
    ALL_DEVICE_STATUS = "devices/+/status"
    ALL_DEVICE_HEARTBEAT = "devices/+/heartbeat"
    ALL_DEVICE_DATA = "devices/+/data"
    ALL_DEVICE_LOGS = "devices/+/logs"
