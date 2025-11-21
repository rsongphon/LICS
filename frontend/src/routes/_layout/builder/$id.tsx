import { createFileRoute } from '@tanstack/react-router'
import { Flex, Heading, Box } from '@chakra-ui/react'
import { ComponentPalette } from '../../../components/psychopy/ComponentPalette'
import { BuilderCanvas } from '../../../components/psychopy/BuilderCanvas'
import { PropertiesPanel } from '../../../components/psychopy/PropertiesPanel'

export const Route = createFileRoute('/_layout/builder/$id')({
    component: BuilderPage,
})

function BuilderPage() {
    const { id } = Route.useParams()

    return (
        <Box h="calc(100vh - 60px)" display="flex" flexDirection="column">
            <Box p={4} borderBottom="1px" borderColor="gray.200">
                <Heading size="md">Experiment Builder - {id}</Heading>
            </Box>
            <Flex flex="1" overflow="hidden">
                <ComponentPalette />
                <Box flex="1" position="relative">
                    <BuilderCanvas />
                </Box>
                <PropertiesPanel />
            </Flex>
        </Box>
    )
}
