import { signIn } from "@/actions/authentication";

export const signInFun = async (username: string, password: string) => {
    console.log("signInFun", username, password);
    const response = await signIn(username, password);
    console.log(response)
}