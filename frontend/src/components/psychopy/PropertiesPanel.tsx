import { Box, Text, VStack } from "@chakra-ui/react"
import { useBuilderStore } from "../../stores/BuilderStore"
import { KeyboardPropertiesForm } from "./forms/KeyboardPropertiesForm"
import { TextPropertiesForm } from "./forms/TextPropertiesForm"

const PropertiesPanel = () => {
  const { selectedNode, nodes } = useBuilderStore()

  // Get the current node data from the nodes array to ensure we have fresh data
  const currentNode = selectedNode
    ? nodes.find(n => n.id === selectedNode.id) || selectedNode
    : null

  if (!currentNode) {
    return (
      <Box
        w="300px"
        h="100%"
        bg="gray.100"
        borderLeft="1px"
        borderColor="gray.200"
        p={4}
      >
        <Text color="gray.500" textAlign="center" mt={10}>
          Select a component to edit properties
        </Text>
      </Box>
    )
  }

  return (
    <Box
      w="300px"
      h="100%"
      bg="white"
      borderLeft="1px"
      borderColor="gray.200"
      p={4}
      overflowY="auto"
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Properties
      </Text>
      <VStack align="stretch" gap={4}>
        <Text fontWeight="medium">Type: {currentNode.data.type}</Text>
        <Text fontSize="sm" color="gray.500">
          ID: {currentNode.id}
        </Text>

        {currentNode.data.type === "text" && (
          <TextPropertiesForm node={currentNode} />
        )}

        {currentNode.data.type === "keyboard" && (
          <KeyboardPropertiesForm node={currentNode} />
        )}

        {/* Add other forms here */}
      </VStack>
    </Box>
  )
}

export default PropertiesPanel
