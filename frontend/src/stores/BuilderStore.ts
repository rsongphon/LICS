import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "reactflow"
import { create } from "zustand"

export interface BuilderState {
  nodes: Node[]
  edges: Edge[]
  componentProps: Record<string, any>
  selectedNode: Node | null

  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  addNode: (node: Node) => void
  setNodeProps: (nodeId: string, props: any) => void
  setSelectedNode: (node: Node | null) => void
  setExperimentData: (data: any) => void
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  nodes: [],
  edges: [],
  componentProps: {},
  selectedNode: null,

  onNodesChange: (changes: NodeChange[]) => {
    const currentState = get()
    const updatedNodes = applyNodeChanges(changes, currentState.nodes)

    // Check if any nodes were removed
    const removedNodeIds = changes
      .filter((change) => change.type === 'remove')
      .map((change) => change.id)

    // Clear selectedNode if it was removed
    const updatedSelectedNode =
      currentState.selectedNode && removedNodeIds.includes(currentState.selectedNode.id)
        ? null
        : currentState.selectedNode

    // Clean up componentProps for removed nodes
    const updatedComponentProps = { ...currentState.componentProps }
    removedNodeIds.forEach((id) => {
      delete updatedComponentProps[id]
    })

    set({
      nodes: updatedNodes,
      selectedNode: updatedSelectedNode,
      componentProps: updatedComponentProps,
    })
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    })
  },

  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
      // Initialize props if needed
      componentProps: {
        ...get().componentProps,
        [node.id]: node.data || {},
      },
    })
  },

  setNodeProps: (nodeId: string, props: any) => {
    set((state) => {
      // Update componentProps
      const updatedComponentProps = {
        ...state.componentProps,
        [nodeId]: { ...state.componentProps[nodeId], ...props },
      }

      // Also update the node's data in the nodes array to keep everything in sync
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...props },
            // Update position if x/y are in props
            ...(props.x !== undefined || props.y !== undefined
              ? {
                position: {
                  x: props.x ?? node.position.x,
                  y: props.y ?? node.position.y,
                },
              }
              : {}),
          }
        }
        return node
      })

      // DO NOT update selectedNode here - it causes infinite loops!
      // The PropertiesPanel will get updated node data from the nodes array
      // through Zustand's reactive system when it accesses selectedNode
      return {
        componentProps: updatedComponentProps,
        nodes: updatedNodes,
      }
    })
  },

  setSelectedNode: (node: Node | null) => {
    set({ selectedNode: node })
  },

  setExperimentData: (data: any) => {
    // Parse the loaded data into nodes/edges/props
    // This assumes data structure matches what we save
    if (data?.react_flow) {
      set({
        nodes: data.react_flow.nodes || [],
        edges: data.react_flow.edges || [],
        componentProps: data.component_props || {}, // Assuming we save props separately or extract them
      })
    }
  },
}))
