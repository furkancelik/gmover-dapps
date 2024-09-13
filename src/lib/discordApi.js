import fetch from "node-fetch";

const DISCORD_API_ENDPOINT = "https://discord.com/api/v10";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

export async function checkUserInGuild(userId) {
  try {
    const response = await discordApiRequest(
      `/guilds/${GUILD_ID}/members/${userId}`
    );
    // Eğer kullanıcı sunucuda değilse, Discord API 404 hatası döndürür
    return true;
  } catch (error) {
    if (error.message.includes("404")) {
      console.log(`User ${userId} is not in the guild ${GUILD_ID}`);
      return false;
    }
    console.error("Error checking user in guild:", error);
    throw error;
  }
}

async function discordApiRequest(path, method = "GET", body = null) {
  const url = `${DISCORD_API_ENDPOINT}${path}`;
  console.log(`Making Discord API request to: ${url}`);

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  console.log(`Discord API Response Status: ${response.status}`);

  const textResponse = await response.text();
  console.log(`Discord API Response Body: ${textResponse}`);

  if (!response.ok) {
    throw new Error(
      `Discord API Error: ${response.status} ${response.statusText}\nBody: ${textResponse}`
    );
  }

  // Only try to parse as JSON if the response is not empty
  return textResponse ? JSON.parse(textResponse) : null;
}

export async function checkUserRole(userId, roleId) {
  try {
    const member = await discordApiRequest(
      `/guilds/${GUILD_ID}/members/${userId}`
    );
    return member.roles.includes(roleId);
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
}

export async function addRoleToDiscordUser(userId, roleId) {
  try {
    await discordApiRequest(
      `/guilds/${GUILD_ID}/members/${userId}/roles/${roleId}`,
      "PUT"
    );
    return true;
  } catch (error) {
    console.error("Error adding role to user:", error);
    throw error;
  }
}
