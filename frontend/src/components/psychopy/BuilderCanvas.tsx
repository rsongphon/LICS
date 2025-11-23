import { useCallback } from "react"
import ReactFlow, { Background, Controls, MiniMap, type Node } from "reactflow"
import "reactflow/dist/style.css"
import { Box } from "@chakra-ui/react"
import { useDrop } from "react-dnd"
import { useBuilderStore } from "../../stores/BuilderStore"

const BuilderCanvas = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode,
  } = useBuilderStore()

  const [, drop] = useDrop(() => ({
    accept: "component",
    drop: (item: { type: string }, monitor) => {
      const offset = monitor.getClientOffset()
      // Get the canvas bounds to calculate relative position
      const canvasBounds = document
        .querySelector(".react-flow__renderer")
        ?.getBoundingClientRect()

      let position = { x: 100, y: 100 } // Default fallback

      if (offset && canvasBounds) {
        // Calculate position relative to the canvas
        // We also need to account for the current viewport transform (zoom/pan)
        // But for now, let's just get it relative to the container
        // Ideally we'd use reactFlowInstance.project({ x: ..., y: ... })
        // but we don't have easy access to the instance here without more setup
        position = {
          x: offset.x - canvasBounds.left,
          y: offset.y - canvasBounds.top,
        }
      }

      const newNode: Node = {
        id: crypto.randomUUID(),
        type: item.type, // Use the dropped item type
        position,
        data: { label: item.type, type: item.type },
      }
      addNode(newNode)
    },
  }))

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node)
    },
    [setSelectedNode],
  )

  return (
    <Box ref={drop} h="100%" w="100%" bg="gray.50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </Box>
  )
}

export default BuilderCanvas
