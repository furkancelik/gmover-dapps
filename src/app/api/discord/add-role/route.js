import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { addRoleToUser } from "@/lib/discordApi";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { roleId } = await request.json();
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

    console.log(
      `Attempting to add role. Guild ID: ${guildId}, User ID: ${userId}, Role ID: ${roleId}`
    );

    const success = await addRoleToUser(guildId, userId, roleId);

    if (success) {
      return new Response(
        JSON.stringify({ message: "Role added successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      throw new Error("Failed to add role");
    }
  } catch (error) {
    console.error("Error in add-role route:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to add role" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
