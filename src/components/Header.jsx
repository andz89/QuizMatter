import React from "react";
import { logout } from "../app/auth/actions";
import Image from "next/image";

import { headers } from "next/headers";
import UserMenu from "./UserMenu";
import { createClient } from "@/src/app/utils/supabase/server";
const Header = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  console.log(pathname);
  if (pathname?.startsWith("/edit")) {
    return null;
  }
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  return (
    <div
      className="
    sticky top-0 z-50
    bg-white/90 backdrop-blur-md
    border border-slate-200
 
    p-2
    shadow-sm
    mb-1
  "
    >
      <div className="flex justify-between px-2 items-center">
        <div>
          <Image
            src="/quizmatter-logo.png"
            alt="School Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>
        <div>
          <UserMenu user={user} logout={logout} />
        </div>
      </div>
    </div>
  );
};

export default Header;
