"use client";

import { supabase } from "../utils/supabase/client";

import Image from "next/image";
const signin = () => {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google OAuth error:", error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center bg-slate-900 text-white p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Quiz <span className="text-orange-400">Matter</span>
          </h1>

          <p className="mt-2 text-slate-300 text-base md:text-lg leading-relaxed">
            Where Every Question Matters
          </p>

          <div className="mt-8 md:mt-10 space-y-4 text-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              Fast quiz creation
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              Rich text editor support
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              Publish and share instantly
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              Browse ready-made quiz templates
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8 md:p-14 bg-white">
          <div className="w-full max-w-sm">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800">
                Welcome Back
              </h2>

              <p className="text-slate-500 mt-2 leading-relaxed">
                Sign in to start browsing quiz templates
                <br />
                and create new ones
              </p>
            </div>

            <div className="my-8 border-t border-slate-200"></div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="
            flex w-full items-center justify-center gap-3
            rounded-xl
            border border-slate-300
            bg-white
            py-3
            font-medium
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
            hover:shadow-md
            cursor-pointer
          "
            >
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                width={18}
                height={18}
                alt="Google"
              />
              Continue with Google
            </button>

            <p className="text-xs text-center text-slate-400 mt-6 leading-relaxed">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default signin;
