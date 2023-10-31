import connectDB from "@utils/database";
import user from "@models/user";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";


const authOptions = {  
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

 
  async authorize(credentials, req) {
    // ... your authorization logic ...
   await connectDB();
   
    try {
        
        const User = await user.findOne({
            email: credentials.email,
         
        });

        if (User) {
            console.log("User found:", User); 
            const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                User.password
            );

            if (isPasswordCorrect) {
                 return User;
            } else {
                throw new Error("Wrong password");
            }
        } else {
            return null;
        }
      } catch (err) {
        console.error("Authorization Error:", err);
        throw new Error(err.message);
      }
    }
  })
 ],

 
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await user.findOne({ email: session.user.email, id: session.user._id });
      session.user._id = sessionUser._id.toString();
      /**  console.log("Session User:", sessionUser);*/   
      return session; 
      
    },

  },
 
};
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};
