import React from "react";
import { logout } from "../app/auth/actions";
import { requireUser } from "../data-access/quiz";
import UserMenu from "./UserMenu";
import { createClient } from "@/src/app/utils/supabase/server";
const Header = async () => {
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
        <div>Logo</div>
        <div>
          <UserMenu user={user} logout={logout} />
        </div>
      </div>
    </div>
  );
};

export default Header;
