import { Box, Center, Spinner, Text } from "@chakra-ui/react"
import Editor from "@monaco-editor/react"
import type React from "react"

interface CodePreviewProps {
  code: string | null
  isLoading?: boolean
}

const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Center h="100%" w="100%">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  if (!code) {
    return (
      <Center h="100%" w="100%" bg="gray.50">
        <Text color="gray.500">
          No code generated yet. Click "Compile" to generate Python code.
        </Text>
      </Center>
    )
  }

  return (
    <Box h="100%" w="100%" border="1px" borderColor="gray.200">
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
        }}
      />
    </Box>
  )
}

export default CodePreview
