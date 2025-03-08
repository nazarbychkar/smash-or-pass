"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { dbAddPhotoRating, dbRedisGetPhoto } from "@/lib/db";

// TODO: make that photos of themselves would not be appearing
interface GameProps {
  userId: number;
}


export default function Game(props: GameProps) {
  const [photo, setPhoto] = useState<Record<string, any>>();
  const [rating, setRating] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitTrigger, setSubmitTrigger] = useState<number>(0); // Add trigger state

  useEffect(() => {
    async function getPhoto() {
      setLoading(true);

      if (photo && rating > 0) {
        setSubmitting(true);
        try {
          await dbAddPhotoRating(photo.photo_id, rating);
        } catch (error) {
          console.error("Error submitting rating:", error);
        } finally {
          setSubmitting(false);
        }
      }

      try {
        const photoDB = await dbRedisGetPhoto(props.userId);
        console.log(photoDB);
        if (!photoDB) {
          throw Error("No photo available");
        }
        setPhoto(photoDB);
        setRangeInput(5); // Reset to middle value
      } catch (error) {
        console.log("Error fetching photo:", error);
        setPhoto(undefined);
      } finally {
        setLoading(false);
      }
    }

    getPhoto();
  }, [submitTrigger, props.userId]);

  const handleSubmit = () => {
    setRating(rangeInput);
    setSubmitTrigger((prev) => prev + 1);
  };

  const getRatingLabel = (value: number) => {
    if (value <= 2) return "Pass 👎";
    if (value <= 4) return "Meh 😐";
    if (value <= 6) return "Okay 🙂";
    if (value <= 8) return "Nice 😍";
    return "Smash! 🔥";
  };

  const getRatingColor = (value: number) => {
    if (value <= 2) return "bg-error";
    if (value <= 4) return "bg-warning";
    if (value <= 6) return "bg-info";
    if (value <= 8) return "bg-success";
    return "bg-primary";
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl mb-4">Rate This Photo</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4 text-base-content/70">Loading next photo...</p>
          </div>
        ) : photo ? (
          <>
            <div className="relative max-w-md aspect-square mb-6 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={photo?.imgur_link || "/placeholder.svg"}
                width={250}
                height={250}
                // fill
                // sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                alt="Photo to rate"
                priority
              />
            </div>

            <div className="max-w-md">
              <div className="flex justify-between mb-2">
                <span className="text-error">Pass</span>
                <span className="text-primary">Smash</span>
              </div>

              <input
                type="range"
                min={0}
                max={10}
                value={rangeInput}
                onChange={(e) => setRangeInput(Number.parseInt(e.target.value))}
                className="range range-lg"
                step={1}
              />

              <div className="w-full flex justify-between text-xs px-2">
                <span>0</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>5</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>10</span>
              </div>

              <div className="mt-6 flex flex-col items-center">
                <div
                  className={`badge badge-lg ${getRatingColor(
                    rangeInput
                  )} text-white mb-4`}
                >
                  {getRatingLabel(rangeInput)}
                </div>

                <button
                  className={`btn btn-primary btn-lg ${
                    submitting ? "loading" : ""
                  }`}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Rating"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-base-content/30"
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
            <p className="mt-4 text-base-content/70">
              No photos available to rate
            </p>
            <p className="text-sm text-base-content/50">
              Try using the refill button below
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
