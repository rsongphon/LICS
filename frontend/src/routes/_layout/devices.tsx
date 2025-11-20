import { Container, Heading, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/devices")({
    component: Devices,
})

function Devices() {
    const { user } = useAuth()

    return (
        <Container maxW="full">
            <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
                Devices
            </Heading>
            <Text>Welcome {user?.full_name || user?.email}!</Text>
            <Text mt={4}>This is the placeholder for the Devices list (Phase 3).</Text>
        </Container>
    )
}
