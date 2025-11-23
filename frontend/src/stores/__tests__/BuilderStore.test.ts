import { act } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { useBuilderStore } from "../BuilderStore"

describe("BuilderStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useBuilderStore.setState({
      nodes: [],
      edges: [],
      componentProps: {},
      selectedNode: null,
    })
  })

  it("should add a node", () => {
    const newNode = {
      id: "1",
      type: "text",
      position: { x: 0, y: 0 },
      data: { label: "Text Node" },
    }

    act(() => {
      useBuilderStore.getState().addNode(newNode)
    })

    const state = useBuilderStore.getState()
    expect(state.nodes).toHaveLength(1)
    expect(state.nodes[0]).toEqual(newNode)
    expect(state.componentProps["1"]).toEqual(newNode.data)
  })

  it("should set node properties", () => {
    const newNode = {
      id: "1",
      type: "text",
      position: { x: 0, y: 0 },
      data: { label: "Text Node" },
    }

    act(() => {
      useBuilderStore.getState().addNode(newNode)
      useBuilderStore.getState().setNodeProps("1", { text: "Hello" })
    })

    const state = useBuilderStore.getState()
    expect(state.componentProps["1"]).toEqual({
      label: "Text Node",
      text: "Hello",
    })
    // Also verify node data is updated (for React Flow)
    expect(state.nodes[0].data).toEqual({ label: "Text Node", text: "Hello" })
  })

  it("should select a node", () => {
    const newNode = {
      id: "1",
      type: "text",
      position: { x: 0, y: 0 },
      data: { label: "Text Node" },
    }

    act(() => {
      useBuilderStore.getState().addNode(newNode)
      useBuilderStore.getState().setSelectedNode(newNode)
    })

    expect(useBuilderStore.getState().selectedNode).toEqual(newNode)
  })
})
