import imageUpload from "./imageUpload";

export default function PhotoManager() {
  return (
    <div>
      <form action={imageUpload}>
        <input type="file" name="image" id="image" />
        <input type="submit" />
      </form>
    </div>
  );
}
