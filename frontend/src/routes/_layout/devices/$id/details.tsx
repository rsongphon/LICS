import { Container, Heading, VStack, Text, Badge, Spinner, Flex, Box, Code } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { DevicesService } from "@/client"

export const Route = createFileRoute("/_layout/devices/$id/details")({
    component: DeviceDetails,
})

function DeviceDetails() {
    const { id } = Route.useParams()

    const { data: device, isLoading, error } = useQuery({
        queryKey: ["devices", id],
        queryFn: () => DevicesService.readDevice({ id }),
    })

    if (isLoading) return <Flex justify="center" p={10}><Spinner /></Flex>
    if (error) return <Text color="red.500">Error loading device details</Text>
    if (!device) return <Text>Device not found</Text>

    return (
        <Container maxW="container.md">
            <Heading mb={6}>{device.name}</Heading>
            <VStack align="stretch" gap={4}>
                <Box>
                    <Text fontWeight="bold">Status</Text>
                    <Badge colorPalette={device.status === "online" ? "green" : "red"}>
                        {device.status}
                    </Badge>
                </Box>
                <Box>
                    <Text fontWeight="bold">Device ID</Text>
                    <Code>{device.device_id}</Code>
                </Box>
                <Box>
                    <Text fontWeight="bold">Location</Text>
                    <Text>{device.location || "N/A"}</Text>
                </Box>
                <Box>
                    <Text fontWeight="bold">Last Seen</Text>
                    <Text>{device.last_seen ? new Date(device.last_seen).toLocaleString() : "Never"}</Text>
                </Box>
                <Box>
                    <Text fontWeight="bold">Capabilities</Text>
                    <Code display="block" whiteSpace="pre" p={2} mt={2}>
                        {JSON.stringify(device.capabilities, null, 2)}
                    </Code>
                </Box>
            </VStack>
        </Container>
    )
}
