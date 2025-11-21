import { Box, VStack, Text, Icon, Flex } from '@chakra-ui/react'
import { FaFont, FaImage, FaKeyboard, FaVolumeUp } from 'react-icons/fa'

const components = [
    { type: 'text', label: 'Text', icon: FaFont },
    { type: 'image', label: 'Image', icon: FaImage },
    { type: 'keyboard', label: 'Keyboard', icon: FaKeyboard },
    { type: 'sound', label: 'Sound', icon: FaVolumeUp },
]

export const ComponentPalette = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    return (
        <Box w="250px" bg="white" borderRight="1px" borderColor="gray.200" p={4}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                Components
            </Text>
            <VStack gap={3} align="stretch">
                {components.map((comp) => (
                    <Flex
                        key={comp.type}
                        align="center"
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        cursor="grab"
                        draggable
                        onDragStart={(event) => onDragStart(event, comp.type)}
                        _hover={{ bg: 'gray.100' }}
                    >
                        <Icon as={comp.icon} mr={3} color="blue.500" />
                        <Text>{comp.label}</Text>
                    </Flex>
                ))}
            </VStack>
        </Box>
    )
}
