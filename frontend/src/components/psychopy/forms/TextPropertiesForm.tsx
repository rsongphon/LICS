import { Input, VStack } from "@chakra-ui/react"
import { useEffect, useRef } from "react"
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

  // Track the current node ID to detect when selection changes
  const previousNodeIdRef = useRef(node.id)
  // Track if this is the initial mount to avoid calling setNodeProps on load
  const isInitialMountRef = useRef(true)

  // Watch individual fields instead of all values to avoid new object references
  const text = watch("text")
  const duration = watch("duration")
  const x = watch("x")
  const y = watch("y")

  // Update store when fields change
  useEffect(() => {
    // Skip the initial mount - don't call setNodeProps with default values
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      return
    }

    // Only update store if this is the same node (user is editing)
    // Skip updates when switching nodes
    if (previousNodeIdRef.current === node.id) {
      setNodeProps(node.id, { text, duration, x, y })
    }
  }, [node.id, setNodeProps, text, duration, x, y])

  // Update form when node selection changes to a different node
  useEffect(() => {
    if (previousNodeIdRef.current !== node.id) {
      setValue("text", node.data.text || "Hello World")
      setValue("duration", node.data.duration || 1.0)
      setValue("x", node.position.x)
      setValue("y", node.position.y)
      previousNodeIdRef.current = node.id
      isInitialMountRef.current = true // Reset for the new node
    }
  }, [node.id, node.data.text, node.data.duration, node.position.x, node.position.y, setValue])

  // Update form position fields when the node is dragged (position changes for the same node)
  useEffect(() => {
    // Only update if we're looking at the same node and position has actually changed
    if (previousNodeIdRef.current === node.id) {
      const currentX = watch("x")
      const currentY = watch("y")

      // Only update if the position has actually changed to avoid unnecessary updates
      if (currentX !== node.position.x || currentY !== node.position.y) {
        setValue("x", node.position.x)
        setValue("y", node.position.y)
      }
    }
  }, [node.position.x, node.position.y, node.id, setValue, watch])


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
