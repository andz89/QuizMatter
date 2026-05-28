"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {
    error: null,
  });

  return (
    <form
      action={formAction}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4"
    >
      <h1 className="text-2xl font-bold">Welcome back</h1>

      {state?.error && (
        <div className="text-red-500 text-sm bg-red-100 p-2 rounded">
          {state.error}
        </div>
      )}

      <div>
        <label className="text-sm block mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      <div>
        <label className="text-sm block mb-1">Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-black text-white py-2 rounded-lg"
      >
        {pending ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
