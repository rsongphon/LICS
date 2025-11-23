import {
    Badge,
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
import { type DevicePublic, DevicesService } from "@/client"
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

export const Route = createFileRoute("/_layout/devices/")({
    component: Devices,
})

function Devices() {
    const queryClient = useQueryClient()
    const { data, isLoading, error } = useQuery({
        queryKey: ["devices"],
        queryFn: () => DevicesService.readDevices(),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => DevicesService.deleteDevice({ id: id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] })
            toaster.create({
                title: "Device deleted successfully",
                type: "success",
            })
        },
        onError: (err) => {
            toaster.create({
                title: "Error deleting device",
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
    if (error) return <Text color="red.500">Error loading devices</Text>

    return (
        <Container maxW="full">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg">Devices</Heading>
                <Button asChild colorPalette="blue">
                    <Link to="/devices/register">
                        <FiPlus style={{ marginRight: "8px" }} /> Register Device
                    </Link>
                </Button>
            </Flex>

            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader role="columnheader">Name</Table.ColumnHeader>
                        <Table.ColumnHeader role="columnheader">Status</Table.ColumnHeader>
                        <Table.ColumnHeader role="columnheader">
                            Location
                        </Table.ColumnHeader>
                        <Table.ColumnHeader role="columnheader">
                            Last Seen
                        </Table.ColumnHeader>
                        <Table.ColumnHeader role="columnheader">Actions</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data?.data.map((device: DevicePublic) => (
                        <Table.Row key={device.id}>
                            <Table.Cell>{device.name}</Table.Cell>
                            <Table.Cell>
                                <Badge
                                    colorPalette={device.status === "online" ? "green" : "red"}
                                >
                                    {device.status}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>{device.location}</Table.Cell>
                            <Table.Cell>
                                {device.last_seen
                                    ? new Date(device.last_seen).toLocaleString()
                                    : "Never"}
                            </Table.Cell>
                            <Table.Cell>
                                <Flex gap={2}>
                                    <Button asChild size="sm" variant="outline">
                                        <Link
                                            to="/devices/$deviceId/details"
                                            params={{ deviceId: device.id }}
                                        >
                                            Details
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
                                                <DialogTitle>Delete Device</DialogTitle>
                                            </DialogHeader>
                                            <DialogBody>
                                                Are you sure you want to delete this device? This action
                                                cannot be undone.
                                            </DialogBody>
                                            <DialogFooter>
                                                <DialogActionTrigger asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogActionTrigger>
                                                <DialogActionTrigger asChild>
                                                    <Button
                                                        colorPalette="red"
                                                        onClick={() => deleteMutation.mutate(device.id)}
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
        </Container>
    )
}
