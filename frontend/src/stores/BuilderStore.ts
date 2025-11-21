import { create } from "zustand"
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
} from "reactflow"

export interface BuilderState {
    nodes: Node[]
    edges: Edge[]
    selectedNode: Node | null
    onNodesChange: OnNodesChange
    onEdgesChange: OnEdgesChange
    onConnect: OnConnect
    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
    addNode: (node: Node) => void
    setSelectedNode: (node: Node | null) => void
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
    nodes: [],
    edges: [],
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
    setNodes: (nodes: Node[]) => set({ nodes }),
    setEdges: (edges: Edge[]) => set({ edges }),
    addNode: (node: Node) => set({ nodes: [...get().nodes, node] }),
    setSelectedNode: (node: Node | null) => set({ selectedNode: node }),
}))
