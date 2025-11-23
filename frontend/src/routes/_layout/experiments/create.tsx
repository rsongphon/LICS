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
import { type ExperimentCreate, ExperimentsService } from "@/client"
import { Field } from "@/components/ui/field"
import { toaster } from "@/components/ui/toaster"

export const Route = createFileRoute("/_layout/experiments/create")({
  component: CreateExperiment,
})

function CreateExperiment() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExperimentCreate>()

  const mutation = useMutation({
    mutationFn: (data: ExperimentCreate) =>
      ExperimentsService.createExperiment({ requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] })
      toaster.create({
        title: "Experiment created",
        type: "success",
      })
      navigate({ to: "/experiments" })
    },
    onError: (err) => {
      toaster.create({
        title: "Error creating experiment",
        description: err.message,
        type: "error",
      })
    },
  })

  const onSubmit = (data: ExperimentCreate) => {
    mutation.mutate({ ...data, psyexp_data: {} })
  }

  return (
    <Container maxW="container.md">
      <Heading mb={6}>Create Experiment</Heading>
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

          <Flex gap={4}>
            <Button type="submit" loading={isSubmitting} colorPalette="blue">
              Create
            </Button>
            <Button variant="outline" asChild>
              <Link to="/experiments">Cancel</Link>
            </Button>
          </Flex>
        </VStack>
      </form>
    </Container>
  )
}
