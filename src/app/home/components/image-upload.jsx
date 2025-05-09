"use client";
import React, { useState } from "react";
import ImageUploadModal from "@/components/app-modal/modal.image.component";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import { post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import jwt from "jsonwebtoken";

export default function ImageUploadModel({ isModalOpen, setIsModalOpen }) {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setUploadedImages([]);
    setUploadedImageUrls([]);
    setIsSubmitting(false);
  };

  const handleImageChange = (files) => {
    const safeFiles = Array.isArray(files) ? files : [];
    setUploadedImages(safeFiles);
    const urls = safeFiles.map((file) => URL.createObjectURL(file));
    setUploadedImageUrls(urls);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; 
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      uploadedImages.forEach((file) => {
        formData.append("files", file, file.name.replace(" ", "_"));
      });
      const token = localStorage.getItem("t");
      const decoded = jwt.decode(token);
      const userId = decoded?.id;
      const userLevel = decoded?.level;

      formData.append("studentId", userId);
      formData.append("studentLevel", userLevel);
      formData.append("imgUrl", JSON.stringify(uploadedImageUrls));

      const response = await post(API.imageUpload, formData, true);

      if (response.code === 201 || response.code === 200) {
        console.log("Images uploaded successfully");
        closeModal();
      } else {
        console.error("Failed to upload images");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <ImageUploadModal
      isOpen={isModalOpen}
      onClose={closeModal}
      headerTitle="Student Homework Image Upload"
      showCloseButton={true}
    >
      <div className="container mx-auto w-full p-5">
        <ImageUploader
          multiple={false}
          maxImageSize={{ width: 240, height: 260 }}
          handleImageChange={handleImageChange}
        />
        <div className="mt-12 flex justify-end">
        <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-lg ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-custom-blue text-white"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </ImageUploadModal>
  );
}
