import { Input, VStack } from "@chakra-ui/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import type { Node } from "reactflow"
import { useBuilderStore } from "../../../stores/BuilderStore"
import { Checkbox } from "../../ui/checkbox"
import { Field } from "../../ui/field"

interface KeyboardProperties {
    allowed_keys: string
    duration: number
    store_correct: boolean
    correct_answer: string
}

export const KeyboardPropertiesForm = ({ node }: { node: Node }) => {
    const { setNodeProps } = useBuilderStore()
    const { register, watch, setValue } =
        useForm<KeyboardProperties>({
            defaultValues: {
                allowed_keys: node.data.allowed_keys || "space",
                duration: node.data.duration || 0,
                store_correct: node.data.store_correct || false,
                correct_answer: node.data.correct_answer || "",
            },
        })

    // Watch for changes and update store
    const values = watch()

    useEffect(() => {
        setNodeProps(node.id, values)
    }, [node.id, setNodeProps, values])

    // Update form if node selection changes
    useEffect(() => {
        setValue("allowed_keys", node.data.allowed_keys || "space")
        setValue("duration", node.data.duration || 0)
        setValue("store_correct", node.data.store_correct || false)
        setValue("correct_answer", node.data.correct_answer || "")
    }, [setValue, node.data])

    return (
        <VStack gap={4} align="stretch">
            <Field label="Allowed Keys (comma separated)">
                <Input {...register("allowed_keys")} placeholder="space, left, right" />
            </Field>

            <Field label="Duration (s) (0 = infinite)">
                <Input
                    type="number"
                    step={0.01}
                    min={0}
                    {...register("duration", { valueAsNumber: true })}
                />
            </Field>

            <Checkbox {...register("store_correct")}>Store Correct</Checkbox>

            {values.store_correct && (
                <Field label="Correct Answer">
                    <Input {...register("correct_answer")} />
                </Field>
            )}
        </VStack>
    )
}
