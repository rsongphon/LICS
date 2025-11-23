import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import { useDrag } from "react-dnd"
import { FaFont, FaImage, FaKeyboard, FaMicrochip } from "react-icons/fa"

const DraggableComponent = ({
    type,
    icon,
    label,
}: {
    type: string
    icon: any
    label: string
}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "component",
        item: { type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }))

    return (
        <Box
            ref={drag}
            p={3}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            cursor="grab"
            opacity={isDragging ? 0.5 : 1}
            _hover={{ boxShadow: "md", bg: "gray.50" }}
            w="100%"
        >
            <HStack>
                <Icon as={icon} color="blue.500" />
                <Text fontSize="sm" fontWeight="medium">
                    {label}
                </Text>
            </HStack>
        </Box>
    )
}

const ComponentPalette = () => {
    return (
        <Box
            w="250px"
            h="100%"
            bg="gray.100"
            borderRight="1px"
            borderColor="gray.200"
            p={4}
        >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                Components
            </Text>
            <VStack spacing={3} align="stretch">
                <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="bold"
                    textTransform="uppercase"
                >
                    Stimuli
                </Text>
                <DraggableComponent type="text" icon={FaFont} label="Text" />
                <DraggableComponent type="image" icon={FaImage} label="Image" />

                <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="bold"
                    textTransform="uppercase"
                    mt={4}
                >
                    Responses
                </Text>
                <DraggableComponent
                    type="keyboard"
                    icon={FaKeyboard}
                    label="Keyboard"
                />

                <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="bold"
                    textTransform="uppercase"
                    mt={4}
                >
                    I/O
                </Text>
                <DraggableComponent
                    type="gpio"
                    icon={FaMicrochip}
                    label="GPIO Output"
                />
            </VStack>
        </Box>
    )
}

export default ComponentPalette
