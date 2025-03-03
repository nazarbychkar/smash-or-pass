"use client";

import { useEffect, useState } from "react";
import imageUpload from "./imageUpload";
import { dbGetPhotosByUser } from "./db";
import Image from 'next/image'

export default function PhotoManager(props: any) {
  const [photos, setPhotos] = useState<Record<string, any>[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // TODO: use useEffect, 'cause await is not availiable in client component.
  function handleClick() {
    setRefreshFlag(!refreshFlag);
  }

  useEffect(() => {
    async function photoFetch() {
      // TODO: API routes doesnt see client side cookies, so they don't see "session" cookie
      // const userIdFetch = await fetch("api/user-id");
      // const userIdJson = await userIdFetch.json();
      // const userId = userIdJson.id;
      // console.log("useridfetch", userId)

      const data = await dbGetPhotosByUser(props.userId);

      setPhotos(data);
    }

    photoFetch();
  }, [refreshFlag]);

  return (
    <div>
      <div>
        <form action={imageUpload}>
          <input type="file" name="image" id="image" />
          <input type="submit" />
        </form>
      </div>
      <div>
        <button onClick={handleClick}>↻ Refresh</button>
        <ul>
          {photos.map((photo: any) => (
            <li key={photo.photo_id}>
              <Image
                src={photo.imgur_link}
                width={250}
                height={250}
                alt="Picture of the author"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
