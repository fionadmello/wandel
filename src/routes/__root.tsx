import {
  createRootRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";

import { StatusBar } from "@/components/layout/StatusBar";
import { TabBar } from "@/components/layout/TabBar";
import { supabase } from "@/lib/supabase";

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthRoute = pathname === "/auth";

  return (
    <>
      {!isAuthRoute && <StatusBar />}
      <Outlet />
      {!isAuthRoute && <TabBar />}
    </>
  );
}

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && location.pathname !== "/auth") {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }
    if (user && location.pathname === "/auth") {
      throw redirect({ to: "/morning" });
    }
  },
  component: RootLayout,
});
