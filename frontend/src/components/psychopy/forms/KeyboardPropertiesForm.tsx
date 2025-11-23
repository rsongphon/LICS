import { Input, VStack } from "@chakra-ui/react"
import { useEffect, useRef } from "react"
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
  const { register, watch, setValue } = useForm<KeyboardProperties>({
    defaultValues: {
      allowed_keys: node.data.allowed_keys || "space",
      duration: node.data.duration || 0,
      store_correct: node.data.store_correct || false,
      correct_answer: node.data.correct_answer || "",
    },
  })

  // Track the current node ID to detect when selection changes
  const previousNodeIdRef = useRef(node.id)
  // Track if this is the initial mount to avoid calling setNodeProps on load
  const isInitialMountRef = useRef(true)

  // Watch individual fields instead of all values to avoid new object references
  const allowed_keys = watch("allowed_keys")
  const duration = watch("duration")
  const store_correct = watch("store_correct")
  const correct_answer = watch("correct_answer")

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
      setNodeProps(node.id, { allowed_keys, duration, store_correct, correct_answer })
    }
  }, [node.id, setNodeProps, allowed_keys, duration, store_correct, correct_answer])

  // Update form when node selection changes to a different node
  useEffect(() => {
    if (previousNodeIdRef.current !== node.id) {
      setValue("allowed_keys", node.data.allowed_keys || "space")
      setValue("duration", node.data.duration || 0)
      setValue("store_correct", node.data.store_correct || false)
      setValue("correct_answer", node.data.correct_answer || "")
      previousNodeIdRef.current = node.id
      isInitialMountRef.current = true // Reset for the new node
    }
  }, [node.id, node.data.allowed_keys, node.data.duration, node.data.store_correct, node.data.correct_answer, setValue])


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

      {store_correct && (
        <Field label="Correct Answer">
          <Input {...register("correct_answer")} />
        </Field>
      )}
    </VStack>
  )
}
