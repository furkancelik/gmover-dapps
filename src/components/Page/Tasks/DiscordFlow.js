"use client";
import { useSession, signOut } from "next-auth/react";

import GuildCheck from "./GuildCheck";
import RoleCheck from "./RoleCheck";
import DiscordLoginButton from "./DiscordLoginButton";
import { useMutation } from "@apollo/client";
import { UPDATE_DISCORD } from "@/graphql/queries/land";
import { useEffect } from "react";

export default function DiscordFlow({ landId }) {
  const { data: session } = useSession();
  const [updateDiscord] = useMutation(UPDATE_DISCORD);

  useEffect(() => {
    if (session?.discord) handleDiscordSave();
  }, [session?.discord]);

  const handleDiscordSave = async () => {
    try {
      await updateDiscord({
        variables: {
          landId: landId,
          discord: {
            id: session?.user?.id,
            username: session?.user?.name,
            email: session?.user?.email,
          },
        },
      });
    } catch (error) {
      console.error("Error updating Discord:", error);
    }
  };

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
