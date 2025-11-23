import {
    Button,
    Container,
    Flex,
    Heading,
    Input,
    Spinner,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { DevicesService, type DeviceUpdate } from "@/client"
import { Field } from "@/components/ui/field"
import { toaster } from "@/components/ui/toaster"

export const Route = createFileRoute("/_layout/devices/$deviceId/edit")({
    component: EditDevice,
})

function EditDevice() {
    const { deviceId } = Route.useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {
        data: device,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["devices", deviceId],
        queryFn: () => DevicesService.readDevice({ id: deviceId }),
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<DeviceUpdate>()

    useEffect(() => {
        if (device) {
            reset({
                name: device.name,
                description: device.description,
                location: device.location,
            })
        }
    }, [device, reset])

    const mutation = useMutation({
        mutationFn: (data: DeviceUpdate) =>
            DevicesService.updateDevice({
                id: deviceId,
                requestBody: data,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] })
            toaster.create({
                title: "Device updated successfully",
                type: "success",
            })
            navigate({ to: "/devices" })
        },
        onError: (err) => {
            toaster.create({
                title: "Error updating device",
                description: err.message,
                type: "error",
            })
        },
    })

    const onSubmit = (data: DeviceUpdate) => {
        mutation.mutate(data)
    }

    if (isLoading)
        return (
            <Flex justify="center" p={10}>
                <Spinner />
            </Flex>
        )
    if (error) return <Text color="red.500">Error loading device</Text>
    if (!device) return <Text>Device not found</Text>

    return (
        <Container maxW="container.md">
            <Heading mb={6}>Edit Device</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="stretch" gap={4}>
                    <Field
                        label="Name"
                        invalid={!!errors.name}
                        errorText={errors.name?.message}
                    >
                        <Input {...register("name", { required: "Name is required" })} />
                    </Field>

                    <Field label="Description">
                        <Textarea {...register("description")} />
                    </Field>

                    <Field label="Location">
                        <Input {...register("location")} />
                    </Field>

                    <Flex gap={4}>
                        <Button type="submit" loading={isSubmitting} colorPalette="blue">
                            Save
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/devices">Cancel</Link>
                        </Button>
                    </Flex>
                </VStack>
            </form>
        </Container>
    )
}
