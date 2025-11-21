import { Container, Heading, VStack, Input, Button, Flex } from "@chakra-ui/react"
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { DevicesService, type DeviceRegister } from "@/client"
import { Field } from "@/components/ui/field"
import { toaster } from "@/components/ui/toaster"

export const Route = createFileRoute("/_layout/devices/register")({
    component: RegisterDevice,
})

function RegisterDevice() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DeviceRegister>()

    const mutation = useMutation({
        mutationFn: (data: DeviceRegister) => DevicesService.registerDevice({ requestBody: data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devices"] })
            toaster.create({
                title: "Device registered",
                type: "success",
            })
            navigate({ to: "/devices" })
        },
        onError: (err: any) => {
            const errorDetail = err.body?.detail || err.message || "Unknown error"
            const description = errorDetail.toLowerCase().includes("already exists") || errorDetail.toLowerCase().includes("conflict")
                ? "Device with this ID already exists"
                : errorDetail

            toaster.create({
                title: "Error registering device",
                description,
                type: "error",
            })
        }
    })

    const onSubmit = (data: DeviceRegister) => {
        mutation.mutate(data)
    }

    return (
        <Container maxW="container.md">
            <Heading mb={6}>Register Device</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="stretch" gap={4}>
                    <Field label="Device ID" invalid={!!errors.device_id} errorText={errors.device_id?.message}>
                        <Input {...register("device_id", { required: "Device ID is required" })} />
                    </Field>

                    <Field label="Name" invalid={!!errors.name} errorText={errors.name?.message}>
                        <Input {...register("name", { required: "Name is required" })} />
                    </Field>

                    <Field label="Location">
                        <Input {...register("location")} />
                    </Field>

                    <Flex gap={4}>
                        <Button type="submit" loading={isSubmitting} colorPalette="blue">
                            Register
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
