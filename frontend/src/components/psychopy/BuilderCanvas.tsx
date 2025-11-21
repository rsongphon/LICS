import { useCallback, useRef } from 'react'
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    Node,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { useBuilderStore } from '../../stores/BuilderStore'
import { Box } from '@chakra-ui/react'

const BuilderCanvasContent = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        setSelectedNode,
    } = useBuilderStore()

    // Setup drop target for React DnD (if we were using it for the canvas drop)
    // However, React Flow handles drop events natively on the wrapper
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault()

            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
            const type = event.dataTransfer.getData('application/reactflow')

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type || !reactFlowBounds) {
                return
            }

            const position = {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            }

            // We need to project the position to the flow coordinate system
            // For now, simple offset is a start, but ideally use reactFlowInstance.project(position)
            // We'll improve this when we add the instance ref

            const newNode: Node = {
                id: `${type}-${Date.now()}`,
                type: 'default', // We will use custom types later
                position,
                data: { label: `${type} node` },
            }

            addNode(newNode)
        },
        [addNode]
    )

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node)
    }, [setSelectedNode])

    const onPaneClick = useCallback(() => {
        setSelectedNode(null)
    }, [setSelectedNode])

    return (
        <Box ref={reactFlowWrapper} w="100%" h="100%" bg="gray.50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
            </ReactFlow>
        </Box>
    )
}

export const BuilderCanvas = () => {
    return (
        <ReactFlowProvider>
            <BuilderCanvasContent />
        </ReactFlowProvider>
    )
}
