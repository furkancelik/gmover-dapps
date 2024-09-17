"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function DiscordLoginButton() {
  const { data: session } = useSession();

  if (session?.discord) return null;
  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user.name} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   );
  // }
  return (
    <>
      <div onClick={() => signIn("discord")}>Connect Discord</div>
    </>
  );
}
