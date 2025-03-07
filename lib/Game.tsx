"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { dbAddPhotoRating, dbRedisGetPhoto } from "./db";

// TODO: make that photos of themselves would not be apearing
export default function Game(props: any) {
  const [photo, setPhoto] = useState<Record<string, any>>();
  const [rating, setRating] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<number>(0);

  useEffect(() => {
    async function getPhoto() {
      if (photo) {
        dbAddPhotoRating(photo.photo_id, rating);
      }

      const photoDB = await dbRedisGetPhoto(props.userId);
      if (!photoDB) {
        throw Error("where is photo in game tsx?");
      }

      setPhoto(photoDB);
    }

    getPhoto()
  }, [rating]);

  return (
    <div>
      <Image
        src={photo?.imgur_link || null}
        width={250}
        height={250}
        alt="Picture to rate"
        placeholder="empty"
      />
      <label htmlFor="rating">Choose a rating for this photo:</label>
      <br />
      <input
        type="range"
        id="rating"
        list="values"
        min={0}
        max={10}
        onChange={(e) => setRangeInput(parseInt(e.target.value))}
      />
      <datalist id="values">
        <option value="0" label="eh..."></option>
        <option value="2.5" label="not so bad"></option>
        <option value="5" label="okay"></option>
        <option value="7.5" label="cool"></option>
        <option value="10" label="majestic"></option>
      </datalist>
      <br />
      <button type="button" onClick={() => setRating(rangeInput)}>
        Submit
      </button>
    </div>
  );
}
