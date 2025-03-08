"use server";

import { dbCreatePhoto } from "./db";
import { getUser } from "./getUser";

type imageFormState =
  | {
      errors?: {
        image?: string[];
      };
      message?: string;
    }
  | undefined;

export default async function imageUpload(
  formData: FormData
): Promise<imageFormState | undefined> {
  const image = formData.get("image") as File | null;
  if (!image) {
    return { errors: { image: ["some error with uploading image."] } };
  }

  const clientId = process.env.IMGUR_CLIENT_ID,
    auth = "Client-ID " + clientId;

  if (!clientId) {
    return {errors: {image: ["there is no connection to the imgur, provide clientId in .env"]}}
  }

  const myHeaders = new Headers();
  myHeaders.append("Authorization", auth);

  const newFormData = new FormData();
  newFormData.append("image", image, image.name);
  newFormData.append("type", "image");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: newFormData,
    redirect: "follow" as RequestRedirect,
  };

  try {
    const response = await fetch(
      "https://api.imgur.com/3/image",
      requestOptions
    );
    // .then((response) => response.text())
    // .then((result) => console.log(result))
    // .catch((error) => console.log("error", error));

    if (!response.ok) {
      const errorResponse = await response.json();
      console.log("imgur response isn't ok ): ", errorResponse)
      return {errors: { image: ["something went wrong with sending the image, response problem"]}}
    }

    const result = await response.json();

    const link = result.data.link;
    const user = await getUser();

    if (!user) {
      return {errors: {image: ["how do you even uploaded image without user login? must be my code problem"]}}
    }

    // console.log("link", link)
    dbCreatePhoto(link, user.id);
  } catch (error) {
    console.error("Error uploading image:", error);
    return {errors: { image: ["something went wrong with sending the image, general problem"]}}
  }
}
