// import NextAuth from "next-auth";
// import { cache } from "react";
// import { getSession } from "next-auth/react";

// import { authConfig } from "./config";
// import type { NextApiRequest } from "next";

// const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

// const auth = cache(uncachedAuth);

// export async function isAuthenticated(req:NextApiRequest) {
//   const session = await getSession({ req });
//   if (!session) {
//     throw new Error("Not authenticated");
//   }
//   return session;
// }

// export { auth, handlers, signIn, signOut };
