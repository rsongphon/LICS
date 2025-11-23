import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/devices/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/devices/register"!</div>
}
