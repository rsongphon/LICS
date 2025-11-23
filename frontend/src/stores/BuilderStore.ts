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
    set({
      nodes: applyNodeChanges(changes, get().nodes),
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
    set((state) => ({
      componentProps: {
        ...state.componentProps,
        [nodeId]: { ...state.componentProps[nodeId], ...props },
      },
      // Also update the node data for React Flow to react if needed
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...props } } : n,
      ),
    }))
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
