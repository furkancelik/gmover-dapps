import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const SocialConnections = () => {
  const { data: session } = useSession();

  const handleDiscordSignIn = () => signIn("discord");
  const handleTwitterSignIn = () => signIn("twitter");

  const handleDiscordSignOut = async () => {
    await signOut({ redirect: false });
    // Discord oturumunu kapat ve sayfayı yenile
    window.location.reload();
  };

  const handleTwitterSignOut = async () => {
    await signOut({ redirect: false });
    // Twitter oturumunu kapat ve sayfayı yenile
    window.location.reload();
  };

  return (
    <div>
      <h2>Social Connections</h2>

      <h3>Discord</h3>
      {session?.discord ? (
        <div>
          <p>Connected as: {session.discord.id}</p>
          <button onClick={handleDiscordSignOut}>Disconnect Discord</button>
        </div>
      ) : (
        <button onClick={handleDiscordSignIn}>Connect Discord</button>
      )}

      <h3>Twitter</h3>
      {session?.twitter ? (
        <div>
          <p>Connected as: {session.twitter.id}</p>
          <button onClick={handleTwitterSignOut}>Disconnect Twitter</button>
        </div>
      ) : (
        <button onClick={handleTwitterSignIn}>Connect Twitter</button>
      )}
    </div>
  );
};

export default SocialConnections;
