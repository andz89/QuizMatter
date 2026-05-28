// /proxy.js

import { updateSession } from "./src/app/utils/supabase/updateSession";

export async function middleware(request) {
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
