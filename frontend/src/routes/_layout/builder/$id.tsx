import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spinner,
  Tabs,
  Text,
} from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { FaPlay, FaSave } from "react-icons/fa"

import { ExperimentsService } from "../../../client"
import BuilderCanvas from "../../../components/psychopy/BuilderCanvas"
import CodePreview from "../../../components/psychopy/CodePreview"
import ComponentPalette from "../../../components/psychopy/ComponentPalette"
import PropertiesPanel from "../../../components/psychopy/PropertiesPanel"
import { toaster } from "../../../components/ui/toaster"
import { useBuilderStore } from "../../../stores/BuilderStore"

export const Route = createFileRoute("/_layout/builder/$id")({
  component: BuilderPage,
})

function BuilderPage() {
  const { id } = Route.useParams()
  const queryClient = useQueryClient()
  const { nodes, edges, componentProps, setExperimentData } = useBuilderStore()

  // Track if we've loaded this experiment's data
  const loadedExperimentIdRef = useRef<string | null>(null)

  const {
    data: experiment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["experiment", id],
    queryFn: () => ExperimentsService.readExperiment({ id }),
  })

  useEffect(() => {
    // Only load experiment data once per experiment, or when switching to a different experiment
    if (experiment?.psyexp_data && loadedExperimentIdRef.current !== id) {
      setExperimentData(experiment.psyexp_data)
      loadedExperimentIdRef.current = id
    }
  }, [experiment?.psyexp_data, id, setExperimentData])

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      ExperimentsService.updateExperiment({
        id,
        requestBody: { psyexp_data: data },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiment", id] })
      toaster.create({
        title: "Experiment saved.",
        type: "success",
        duration: 3000,
      })
    },
    onError: () => {
      toaster.create({
        title: "Failed to save experiment.",
        type: "error",
        duration: 3000,
      })
    },
  })

  const compileMutation = useMutation({
    mutationFn: () => ExperimentsService.compileExperiment({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiment", id] })
      toaster.create({
        title: "Experiment compiled.",
        type: "success",
        duration: 3000,
      })
    },
    onError: (error: any) => {
      toaster.create({
        title: "Compilation failed.",
        description: error.body?.detail || "Unknown error",
        type: "error",
        duration: 3000,
      })
    },
  })

  const handleSave = () => {
    const psyexp_data = {
      react_flow: { nodes, edges },
      component_props: componentProps,
    }
    saveMutation.mutate(psyexp_data)
  }

  const handleCompile = async () => {
    // Save first then compile
    const psyexp_data = {
      react_flow: { nodes, edges },
      component_props: componentProps,
    }
    try {
      await saveMutation.mutateAsync(psyexp_data)
      compileMutation.mutate()
    } catch (_e) {
      // Error handled in mutation
    }
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Text color="red.500">Error loading experiment: {error.message}</Text>
      </Flex>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Flex h="calc(100vh - 60px)" direction="column">
        <Flex
          p={4}
          borderBottom="1px"
          borderColor="gray.200"
          justify="space-between"
          align="center"
          bg="white"
        >
          <Heading size="md">
            {experiment?.name || "Experiment Builder"}
          </Heading>
          <HStack gap={2}>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              loading={saveMutation.isPending}
            >
              <FaSave style={{ marginRight: "8px" }} /> Save
            </Button>
            <Button
              colorScheme="green"
              onClick={handleCompile}
              loading={compileMutation.isPending || saveMutation.isPending}
            >
              <FaPlay style={{ marginRight: "8px" }} /> Compile
            </Button>
          </HStack>
        </Flex>

        <Tabs.Root
          lazyMount
          defaultValue="builder"
          h="full"
          display="flex"
          flexDirection="column"
        >
          <Tabs.List
            px={4}
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
          >
            <Tabs.Trigger value="builder">Builder</Tabs.Trigger>
            <Tabs.Trigger value="code">Code Preview</Tabs.Trigger>
          </Tabs.List>

          <Box flex="1" overflow="hidden">
            <Tabs.Content value="builder" p={0} h="full">
              <Flex h="100%">
                <ComponentPalette />
                <Box flex={1} h="100%" position="relative">
                  <BuilderCanvas />
                </Box>
                <PropertiesPanel />
              </Flex>
            </Tabs.Content>
            <Tabs.Content value="code" p={0} h="full">
              <CodePreview
                code={experiment?.python_code || null}
                isLoading={compileMutation.isPending}
              />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>
    </DndProvider>
  )
}
