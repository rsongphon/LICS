import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { FiArrowLeft } from "react-icons/fi"
import { DevicesService } from "@/client"

export const Route = createFileRoute("/_layout/devices/$deviceId/details")({
  component: DeviceDetails,
})

function DeviceDetails() {
  const { deviceId } = Route.useParams()

  const {
    data: device,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["devices", deviceId],
    queryFn: () => DevicesService.readDevice({ id: deviceId }),
  })

  if (isLoading)
    return (
      <Flex justify="center" p={10}>
        <Spinner />
      </Flex>
    )
  if (error)
    return <Text color="red.500">Error loading device: {error.message}</Text>
  if (!device) return <Text>Device not found</Text>

  return (
    <Container maxW="container.md">
      <Button asChild variant="ghost" mb={4}>
        <Link to="/devices">
          <FiArrowLeft /> Back to Devices
        </Link>
      </Button>

      <Heading mb={6}>{device.name}</Heading>

      <Card.Root>
        <Card.Body>
          <VStack align="stretch" gap={4}>
            <Flex justify="space-between">
              <Text fontWeight="bold">Device ID</Text>
              <Text data-testid="device-id">{device.id}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Status</Text>
              <Badge
                colorPalette={device.status === "online" ? "green" : "red"}
              >
                {device.status}
              </Badge>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Location</Text>
              <Text>{device.location || "-"}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Description</Text>
              <Text>{device.description || "-"}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Last Seen</Text>
              <Text>
                {device.last_seen
                  ? new Date(device.last_seen).toLocaleString()
                  : "Never"}
              </Text>
            </Flex>
            <VStack align="stretch">
              <Text fontWeight="bold">Configuration</Text>
              <Card.Root variant="subtle">
                <Card.Body p={2}>
                  <pre style={{ fontSize: "0.8em" }}>
                    {JSON.stringify(device.config, null, 2)}
                  </pre>
                </Card.Body>
              </Card.Root>
            </VStack>
            <VStack align="stretch">
              <Text fontWeight="bold">Capabilities</Text>
              <Card.Root variant="subtle">
                <Card.Body p={2}>
                  <pre style={{ fontSize: "0.8em" }}>
                    {JSON.stringify(device.capabilities, null, 2)}
                  </pre>
                </Card.Body>
              </Card.Root>
            </VStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Container>
  )
}
