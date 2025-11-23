import { Input, VStack } from "@chakra-ui/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import type { Node } from "reactflow"
import { useBuilderStore } from "../../../stores/BuilderStore"
import { Field } from "../../ui/field"

interface TextProperties {
  text: string
  duration: number
  x: number
  y: number
}

export const TextPropertiesForm = ({ node }: { node: Node }) => {
  const { setNodeProps } = useBuilderStore()
  const { register, watch, setValue } = useForm<TextProperties>({
    defaultValues: {
      text: node.data.text || "Hello World",
      duration: node.data.duration || 1.0,
      x: node.position.x,
      y: node.position.y,
    },
  })

  // Watch for changes and update store
  const values = watch()

  useEffect(() => {
    setNodeProps(node.id, values)
  }, [node.id, setNodeProps, values])

  // Update form if node selection changes to a different node (but same type)
  useEffect(() => {
    setValue("text", node.data.text || "Hello World")
    setValue("duration", node.data.duration || 1.0)
    setValue("x", node.position.x)
    setValue("y", node.position.y)
  }, [setValue, node.data, node.position])

  return (
    <VStack gap={4} align="stretch">
      <Field label="Text Content">
        <Input {...register("text")} />
      </Field>

      <Field label="Duration (s)">
        <Input
          type="number"
          step={0.01}
          min={0}
          {...register("duration", { valueAsNumber: true })}
        />
      </Field>

      <Field label="Position X">
        <Input
          type="number"
          step={0.01}
          {...register("x", { valueAsNumber: true })}
        />
      </Field>

      <Field label="Position Y">
        <Input
          type="number"
          step={0.01}
          {...register("y", { valueAsNumber: true })}
        />
      </Field>
    </VStack>
  )
}
