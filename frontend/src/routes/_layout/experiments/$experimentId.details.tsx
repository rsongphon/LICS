import {
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { FiArrowLeft, FiCpu, FiEdit2, FiTrash2 } from "react-icons/fi"
import { ExperimentsService } from "@/client"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toaster } from "@/components/ui/toaster"

export const Route = createFileRoute(
  "/_layout/experiments/$experimentId/details",
)({
  component: ExperimentDetails,
})

function ExperimentDetails() {
  const { experimentId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: experiment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["experiments", experimentId],
    queryFn: () => ExperimentsService.readExperiment({ id: experimentId }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ExperimentsService.deleteExperiment({ id: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] })
      toaster.create({
        title: "Experiment deleted successfully",
        type: "success",
      })
      navigate({ to: "/experiments" })
    },
    onError: (err) => {
      toaster.create({
        title: "Error deleting experiment",
        description: err.message,
        type: "error",
      })
    },
  })

  if (isLoading)
    return (
      <Flex justify="center" p={10}>
        <Spinner />
      </Flex>
    )
  if (error)
    return (
      <Text color="red.500">Error loading experiment: {error.message}</Text>
    )
  if (!experiment) return <Text>Experiment not found</Text>

  return (
    <Container maxW="container.md">
      <Button asChild variant="ghost" mb={4}>
        <Link to="/experiments">
          <FiArrowLeft /> Back to Experiments
        </Link>
      </Button>

      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl">{experiment.name}</Heading>
        <Flex gap={2}>
          <Button asChild colorPalette="purple">
            <Link to="/builder/$id" params={{ id: experiment.id }}>
              <FiCpu /> Open Builder
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              to="/experiments/$experimentId/edit"
              params={{ experimentId: experiment.id }}
            >
              <FiEdit2 /> Edit
            </Link>
          </Button>
          <DialogRoot>
            <DialogTrigger asChild>
              <Button colorPalette="red" variant="outline">
                <FiTrash2 /> Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Experiment</DialogTitle>
              </DialogHeader>
              <DialogBody>
                Are you sure you want to delete this experiment? This action
                cannot be undone.
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <DialogActionTrigger asChild>
                  <Button
                    colorPalette="red"
                    onClick={() => deleteMutation.mutate(experiment.id)}
                  >
                    Delete
                  </Button>
                </DialogActionTrigger>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
        </Flex>
      </Flex>

      <Card.Root>
        <Card.Body>
          <VStack align="stretch" gap={4}>
            <Flex justify="space-between">
              <Text fontWeight="bold">Experiment ID</Text>
              <Text>{experiment.id}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Description</Text>
              <Text>{experiment.description || "-"}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Created At</Text>
              <Text>{new Date(experiment.created_at).toLocaleString()}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Created By</Text>
              <Text>{experiment.created_by || "-"}</Text>
            </Flex>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Container>
  )
}
