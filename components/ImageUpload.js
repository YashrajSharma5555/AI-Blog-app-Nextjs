import { useState } from "react";

export default function ImageUpload({ onUpload }) {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(""); // Store file name
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name); // Set file name
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image");

    setUploading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setUploading(false);

      if (data.secure_url) {
        alert("Upload successful!");
        onUpload(data.secure_url); // Pass URL to parent component
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload error");
      setUploading(false);
    }
  };

  return (
    <div className="flex w-full flex-row items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
      {/* File Input */}
      <label className="flex flex-col items-center justify-center w-full max-w-xs px-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
        <span className="font-semibold">Choose an image</span>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="hidden"
        />
      </label>

      {/* Display Selected File Name */}
      {imageName && (
        <p className="text-gray-700 dark:text-gray-300">{imageName}</p>
      )}

      {/* Upload Button */}
      <button
        className="w-full max-w-xs py-2 text-white font-semibold rounded-lg shadow-md transition-all duration-300 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-600"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
