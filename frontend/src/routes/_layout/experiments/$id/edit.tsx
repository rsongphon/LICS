import { Container, Heading, VStack, Input, Textarea, Button, Spinner, Flex } from "@chakra-ui/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ExperimentsService, type ExperimentUpdate } from "@/client"
import { Field } from "@/components/ui/field"
import { toaster } from "@/components/ui/toaster"
import { useEffect } from "react"

export const Route = createFileRoute("/_layout/experiments/$id/edit")({
    component: EditExperiment,
})

function EditExperiment() {
    const { id } = Route.useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: experiment, isLoading } = useQuery({
        queryKey: ["experiments", id],
        queryFn: () => ExperimentsService.readExperiment({ id }),
    })

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ExperimentUpdate>()

    useEffect(() => {
        if (experiment) {
            reset({
                name: experiment.name,
                description: experiment.description,
            })
        }
    }, [experiment, reset])

    const mutation = useMutation({
        mutationFn: (data: ExperimentUpdate) => ExperimentsService.updateExperiment({ id, requestBody: data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["experiments"] })
            toaster.create({
                title: "Experiment updated",
                type: "success",
            })
            navigate({ to: "/experiments" })
        },
        onError: (err) => {
            toaster.create({
                title: "Error updating experiment",
                description: err.message,
                type: "error",
            })
        }
    })

    const onSubmit = (data: ExperimentUpdate) => {
        mutation.mutate(data)
    }

    if (isLoading) return <Flex justify="center" p={10}><Spinner /></Flex>

    return (
        <Container maxW="container.md">
            <Heading mb={6}>Edit Experiment</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="stretch" gap={4}>
                    <Field label="Name" invalid={!!errors.name} errorText={errors.name?.message}>
                        <Input {...register("name", { required: "Name is required" })} />
                    </Field>

                    <Field label="Description">
                        <Textarea {...register("description")} />
                    </Field>

                    <Button type="submit" loading={isSubmitting} colorPalette="blue">
                        Update
                    </Button>
                </VStack>
            </form>
        </Container>
    )
}
