import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { checkUserHasRole } from "@/lib/discordApi";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get("roleId");
    const guildId = process.env.DISCORD_GUILD_ID;
    const userId = session.user.id;

    if (!guildId || !roleId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required information" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hasRole = await checkUserHasRole(guildId, userId, roleId);

    return new Response(JSON.stringify({ hasRole }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in check-role route:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to check role" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
