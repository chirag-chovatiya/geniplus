"use client";
import React, { useEffect, useState } from "react";
import AppModal from "@/components/app-modal/modal.component";
import SubmitButton from "@/components/Button/Submit-button";
import { get, post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextAreaField } from "@/components/app-inputfield/app-textarea";
import { useTeacherAdvStore } from "@/providers/teacheradv-store-provider";
import ImageUploader from "@/components/ImageUploader/ImageUploader";

export default function StudentAdvertise({
  handleCloseStudentForm,
  studentAdvObj,
  id = null,
  data = { imgUrl: "", description: "", status: false },
}) {
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [description, setDescription] = useState(data.description);

  const { initialize } = useTeacherAdvStore((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const response = await get(`${API.teacherAdv}/${id}`);
        if (response.code === 200) {
          setDescription(response.data.description);
  
          const imageUrls = response.data.imgUrl
            ? Array.isArray(response.data.imgUrl)
              ? response.data.imgUrl
              : [response.data.imgUrl]
            : [];
  
          setUploadedImages(imageUrls);
          setUploadedImageUrls(imageUrls);
        } else {
          toast.error("Failed to fetch advertisement data.");
        }
      } catch (error) {
        console.error("Error fetching advertisement data:", error);
        toast.error("There was an error fetching the data.");
      }
    };
    fetchData();
  }, [id]);
  

  const handleImageChange = (files) => {
    setUploadedImages(files);
    setUploadedImageUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      uploadedImages.forEach((file) => {
        formData.append("files", file, file.name.replace(" ", "_"));
      });
      formData.append("description", description);
      formData.append("imgUrl", JSON.stringify(uploadedImageUrls));

      const response = await post(id ? `${API.teacherAdv}/${id}` : API.teacherAdv, formData, true);

      if ([200, 201].includes(response.code)) {
        toast.success(`Student Advertisement ${id ? "updated" : "submitted"} successfully!`);
        handleCloseStudentForm();
        initialize();
      } else if (response.code === 400) {
        toast.error("Another advertisement at this level already has status set to true. Please update it first.");
      } else {
        toast.error(response.message || "Failed to submit form.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("There was an error submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      key="Add Student Advertisement"
      config={studentAdvObj}
      component={
        <>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <div className="grid mb-6 md:grid-cols-1">
              <ImageUploader
                multiple={false}
                maxImageSize={{ width: 240, height: 260 }}
                handleImageChange={handleImageChange}
                defaultImages={uploadedImageUrls}
              />
              <TextAreaField
                id="studentDescription"
                label="Student Advertisement Description"
                required
                placeholder="Enter details about the advertisement..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                name="description"
                rows={3}
              />
            </div>
            <SubmitButton loading={loading} />
          </form>
        </>
      }
      onCloseModal={handleCloseStudentForm}
    />
  );
}
