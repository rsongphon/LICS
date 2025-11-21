import { Button, Center, Flex, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

const NotFound = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>404 Plain</h1>
      <p>The page you are looking for was not found.</p>
      <a href="/">Go Back</a>
    </div>
  )
}

export default NotFound
