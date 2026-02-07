"use server";

import { redirect } from "next/navigation";
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export const signOutAction = async () => {
  const cookieStore = await cookies();

  // Manually delete all Supabase auth cookies
  // This is necessary because supabase.auth.signOut() can't read the session
  // in Server Actions due to cookie handling limitations in Server Components
  const allCookies = cookieStore.getAll();
  allCookies.forEach(cookie => {
    if (cookie.name.startsWith('sb-')) {
      cookieStore.delete(cookie.name);
    }
  });

  // Revalidate the root layout to clear any cached user data
  revalidatePath('/', 'layout');

  // Redirect to root, which will be rewritten to /sign-in by middleware
  return redirect("/");
};
