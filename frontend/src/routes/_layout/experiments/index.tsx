import {
    Button,
    Container,
    Flex,
    Heading,
    Spinner,
    Table,
    Text,
} from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { FiPlus, FiTrash2 } from "react-icons/fi"
import { type ExperimentPublic, ExperimentsService } from "@/client"
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

export const Route = createFileRoute("/_layout/experiments/")({
    component: Experiments,
})

function Experiments() {
    const queryClient = useQueryClient()
    const { data, isLoading, error } = useQuery({
        queryKey: ["experiments"],
        queryFn: () => ExperimentsService.readExperiments(),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => ExperimentsService.deleteExperiment({ id: id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["experiments"] })
            toaster.create({
                title: "Experiment deleted successfully",
                type: "success",
            })
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
    if (error) return <Text color="red.500">Error loading experiments</Text>

    return (
        <Container maxW="full">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg">Experiments</Heading>
                <Button asChild colorPalette="blue">
                    <Link to="/experiments/create">
                        <FiPlus style={{ marginRight: "8px" }} /> Add Experiment
                    </Link>
                </Button>
            </Flex>

            {data?.data.length === 0 ? (
                <Text>
                    No experiments found. Create your first experiment to get started.
                </Text>
            ) : (
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader role="columnheader">Name</Table.ColumnHeader>
                            <Table.ColumnHeader role="columnheader">
                                Description
                            </Table.ColumnHeader>
                            <Table.ColumnHeader role="columnheader">
                                Created At
                            </Table.ColumnHeader>
                            <Table.ColumnHeader role="columnheader">
                                Actions
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data?.data.map((experiment: ExperimentPublic) => (
                            <Table.Row key={experiment.id}>
                                <Table.Cell>{experiment.name}</Table.Cell>
                                <Table.Cell>{experiment.description || "-"}</Table.Cell>
                                <Table.Cell>
                                    {new Date(experiment.created_at).toLocaleDateString()}
                                </Table.Cell>
                                <Table.Cell>
                                    <Flex gap={2}>
                                        <Button asChild size="sm" variant="outline">
                                            <Link
                                                to="/experiments/$experimentId/edit"
                                                params={{ experimentId: experiment.id }}
                                            >
                                                Edit
                                            </Link>
                                        </Button>
                                        <DialogRoot>
                                            <DialogTrigger asChild>
                                                <Button size="sm" colorPalette="red" variant="outline">
                                                    <FiTrash2 /> Delete
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Delete Experiment</DialogTitle>
                                                </DialogHeader>
                                                <DialogBody>
                                                    Are you sure you want to delete this experiment? This
                                                    action cannot be undone.
                                                </DialogBody>
                                                <DialogFooter>
                                                    <DialogActionTrigger asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogActionTrigger>
                                                    <DialogActionTrigger asChild>
                                                        <Button
                                                            colorPalette="red"
                                                            onClick={() =>
                                                                deleteMutation.mutate(experiment.id)
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogActionTrigger>
                                                </DialogFooter>
                                                <DialogCloseTrigger />
                                            </DialogContent>
                                        </DialogRoot>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}
        </Container>
    )
}
