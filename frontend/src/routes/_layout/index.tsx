import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { FiActivity, FiCpu, FiPlus } from "react-icons/fi"
import { DevicesService, ExperimentsService } from "@/client"
import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

function Dashboard() {
  const { user: currentUser } = useAuth()

  const { data: experiments } = useQuery({
    queryKey: ["experiments"],
    queryFn: () => ExperimentsService.readExperiments(),
  })

  const { data: devices } = useQuery({
    queryKey: ["devices"],
    queryFn: () => DevicesService.readDevices(),
  })

  return (
    <Container maxW="full">
      <Box pt={12} m={4}>
        <Text fontSize="2xl" truncate maxW="sm">
          Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
        </Text>
        <Text mb={8}>Welcome back, nice to see you again!</Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
          <Card.Root>
            <Card.Body>
              <Flex align="center" justify="space-between">
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Experiments
                  </Text>
                  <Heading size="xl">{experiments?.data.length || 0}</Heading>
                </Box>
                <Icon as={FiActivity} boxSize={8} color="blue.500" />
              </Flex>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <Flex align="center" justify="space-between">
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Devices
                  </Text>
                  <Heading size="xl">{devices?.data.length || 0}</Heading>
                </Box>
                <Icon as={FiCpu} boxSize={8} color="green.500" />
              </Flex>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        <Heading size="md" mb={4}>
          Quick Actions
        </Heading>
        <Flex gap={4}>
          <Button asChild colorPalette="blue">
            <Link to="/experiments/create">
              <FiPlus style={{ marginRight: "8px" }} /> New Experiment
            </Link>
          </Button>
          <Button asChild colorPalette="green">
            <Link to="/devices/register">
              <FiPlus style={{ marginRight: "8px" }} /> Register Device
            </Link>
          </Button>
        </Flex>
      </Box>
    </Container>
  )
}
