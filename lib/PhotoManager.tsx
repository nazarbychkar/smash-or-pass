"use client";

import type React from "react";

import { useEffect, useState } from "react";
import imageUpload from "@/lib/imageUpload";
import { dbGetPhotosByUser } from "@/lib/db";
import Image from "next/image";

interface PhotoManagerProps {
  userId: number;
}

export default function PhotoManager(props: PhotoManagerProps) {
  const [photos, setPhotos] = useState<Record<string, any>[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  function handleClick() {
    setRefreshFlag(!refreshFlag);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    try {
      await imageUpload(formData);
      setRefreshFlag(!refreshFlag);
      setFileName("");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    async function photoFetch() {
      const data = await dbGetPhotosByUser(props.userId);
      console.log("data useEffect", data);
      setPhotos(data);
    }

    photoFetch();
  }, [refreshFlag, props.userId]);

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Upload New Photo
          </h2>

          <form action={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Choose an image</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="btn btn-outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  {fileName ? "Change File" : "Select File"}
                  <input
                    type="file"
                    name="image"
                    id="image"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {fileName && (
                  <span className="text-sm opacity-70">{fileName}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${isUploading ? "loading" : ""}`}
              disabled={isUploading || !fileName}
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
          </form>
        </div>
      </div>
      <br />
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Your Photos
            </h2>
            <button onClick={handleClick} className="btn btn-outline btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {photos.length == 0 ? (
            <div className="py-8 text-center text-base-content/70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p>No photos uploaded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ul className="flex space-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {photos.map((photo) => (
                  <li
                    key={photo.photo_id}
                    className="transform-gpu hover:scale-105 object-cover w-64 h-64 rounded-xl overflow-hidden shadow-lg card bg-base-200 hover:shadow-lg transition-shadow"
                  >
                    <figure className="relative aspect-square overflow-hidden">
                      <Image
                        src={photo.imgur_link || "/placeholder.svg"}
                        width={250}
                        height={250}
                        // fill
                        // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded-xl"
                        alt="User uploaded photo"
                      />
                    </figure>
                    <div className="bottom-0 left-0 w-full bg-black bg-opacity-60 text-white p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                      Rating: {photo.rating || "oh, we don't know"}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
