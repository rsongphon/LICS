import {
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { type DeviceRegister, DevicesService } from "@/client"
import { Field } from "@/components/ui/field"
import { toaster } from "@/components/ui/toaster"

export const Route = createFileRoute("/_layout/devices/register")({
  component: RegisterDevice,
})

function RegisterDevice() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DeviceRegister>()

  const mutation = useMutation({
    mutationFn: (data: DeviceRegister) =>
      DevicesService.registerDevice({ requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] })
      toaster.create({
        title: "Device registered",
        type: "success",
      })
      navigate({ to: "/devices" })
    },
    onError: (err) => {
      toaster.create({
        title: "Error registering device",
        description: err.message,
        type: "error",
      })
    },
  })

  const onSubmit = (data: DeviceRegister) => {
    mutation.mutate(data)
  }

  return (
    <Container maxW="container.md">
      <Heading mb={6}>Register Device</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align="stretch" gap={4}>
          <Field
            label="Device ID"
            invalid={!!errors.device_id}
            errorText={errors.device_id?.message}
            helperText="Unique identifier for the device (e.g., RPI-001)"
          >
            <Flex gap={2}>
              <Input
                {...register("device_id", { required: "Device ID is required" })}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const randomId = crypto.randomUUID()
                  setValue("device_id", randomId)
                }}
              >
                Generate
              </Button>
            </Flex>
          </Field>

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
