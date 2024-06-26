"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signupAction(name, email, password, setError) {
  try {
    const res = await axios.post(
      `${process.env.BASE_URL}/api/credentials/register`,
      {
        name,
        email,
        password,
      }
    );

    const now = new Date();
    const thrithDay = new Date(now);
    thrithDay.setDate(now.getDate() + 30);

    const { refreshToken, accessToken } = res?.data;
    const accessTokenExpire = new Date(new Date().getTime() + 15 * 60 * 1000);
    const refreshTokenExpire = thrithDay;

    cookies().set("accessToken", accessToken, {
      expires: accessTokenExpire,
      path: "/",
    });
    cookies().set("refreshToken", refreshToken, {
      expires: refreshTokenExpire,
      path: "/",
    });
  } catch (err) {
    console.log(err);
  } finally {
    revalidatePath("/");
    redirect("/");
  }
}

export async function loginAction(email, password, setError) {
  try {
    const res = await axios.post(
      `${process.env.BASE_URL}/api/credentials/login`,
      { email, password }
    );

    const now = new Date();
    const thrithDay = new Date(now);
    thrithDay.setDate(now.getDate() + 30);

    const { refreshToken, accessToken } = res?.data;
    const accessTokenExpire = new Date(new Date().getTime() + 15 * 60 * 1000);
    const refreshTokenExpire = thrithDay;

    cookies().set("accessToken", accessToken, {
      expires: accessTokenExpire,
      path: "/",
      secure: true,
      sameSite: "lax",
    });
    cookies().set("refreshToken", refreshToken, {
      expires: refreshTokenExpire,
      path: "/",
      secure: true,
      sameSite: "lax",
    });

    revalidatePath("/");
    return { status: "success" };
  } catch (err) {
    console.log(err?.response);
    return { status: "fail", message: err?.response?.data?.message };
  }
}
