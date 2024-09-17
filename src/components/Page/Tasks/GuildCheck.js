"use client";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { CHECK_USER_IN_GUILD } from "@/graphql/queries/roleLimit";

export default function GuildCheck({ children }) {
  const { data: session } = useSession();
  const { loading, error, data } = useQuery(CHECK_USER_IN_GUILD, {
    variables: { userId: session?.discord?.id },
    skip: !session?.discord,
  });

  if (!session?.discord) return null;
  if (loading) return <div>Checking Discord server membership...</div>;
  if (error) return <div>Error checking Discord server membership</div>;

  if (!data.checkUserInGuild) {
    return (
      <a
        href="https://discord.gg/XaKQFrFstS"
        target="_blank"
        rel="noopener noreferrer"
      >
        Join our Discord server.
      </a>
    );
  }

  return children;
}
