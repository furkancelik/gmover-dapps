"use client";
import { useSession, signOut } from "next-auth/react";
import DiscordLoginButton from "./DiscordLoginButton";
import GuildCheck from "./GuildCheck";
import RoleCheck from "./RoleCheck";

export default function DiscordFlow({ landId }) {
  const { data: session } = useSession();

  if (!session?.discord) {
    return <DiscordLoginButton />;
  }

  return (
    <GuildCheck>
      {/* <button onClick={() => signOut()}>Sign out</button> */}
      <RoleCheck landId={landId} />
    </GuildCheck>
  );
}
