import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/clients")({ component: () => <Outlet /> });
export { Link };
