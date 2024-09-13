import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify guilds" } },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0", // OAuth 2.0
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        // Yeni bir hesap bağlandığında
        token[account.provider] = {
          accessToken: account.access_token,
          id: account.providerAccountId,
        };
      }
      // Mevcut bilgileri koru
      if (user) {
        token.user = {
          ...token.user,
          ...user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Her iki servisin bilgilerini de session'a ekle
      session.discord = token.discord || null;
      session.twitter = token.twitter || null;
      session.user = {
        ...session.user,
        ...token.user,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
// import NextAuth from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
// import TwitterProvider from "next-auth/providers/twitter";

// export const authOptions = {
//   providers: [
//     DiscordProvider({
//       clientId: process.env.DISCORD_CLIENT_ID,
//       clientSecret: process.env.DISCORD_CLIENT_SECRET,
//       authorization: { params: { scope: "identify guilds" } },
//     }),
//     TwitterProvider({
//       clientId: process.env.TWITTER_CLIENT_ID,
//       clientSecret: process.env.TWITTER_CLIENT_SECRET,
//       version: "2.0", // OAuth 2.0
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token[account.provider] = {
//           accessToken: account.access_token,
//           id: account.providerAccountId,
//         };
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.discord = token.discord || null;
//       session.twitter = token.twitter || null;
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
