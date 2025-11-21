import { Box, Text, VStack, Input } from '@chakra-ui/react'
import { Field } from '../ui/field'
import { useBuilderStore } from '../../stores/BuilderStore'

export const PropertiesPanel = () => {
    const { selectedNode } = useBuilderStore()

    if (!selectedNode) {
        return (
            <Box w="300px" bg="white" borderLeft="1px" borderColor="gray.200" p={4}>
                <Text color="gray.500">Select a component to edit properties</Text>
            </Box>
        )
    }

    return (
        <Box w="300px" bg="white" borderLeft="1px" borderColor="gray.200" p={4}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                Properties
            </Text>
            <VStack gap={4} align="stretch">
                <Box>
                    <Text fontWeight="bold" fontSize="sm" mb={1}>
                        Type
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        {selectedNode.data.label}
                    </Text>
                </Box>

                <Field label="ID">
                    <Input value={selectedNode.id} readOnly size="sm" />
                </Field>

                <Field label="Position X">
                    <Input value={Math.round(selectedNode.position.x)} readOnly size="sm" />
                </Field>

                <Field label="Position Y">
                    <Input value={Math.round(selectedNode.position.y)} readOnly size="sm" />
                </Field>
            </VStack>
        </Box>
    )
}
