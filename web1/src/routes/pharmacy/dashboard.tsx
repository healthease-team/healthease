import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pharmacy/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pharmacy/dashboard"!</div>
}
