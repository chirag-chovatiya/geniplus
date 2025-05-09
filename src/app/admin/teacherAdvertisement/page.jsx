"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/Button/Submit-button";
import { get, post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextAreaField } from "@/components/app-inputfield/app-textarea";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import StatusButton from "@/components/Switchers/StatusButton";

export default function TeacherAdvertisement({ id }) {
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const advId = id || 1;
      try {
        const response = await get(`${API.teacherAdv}/${advId}` + "&");
        if (response.code === 200) {
          setDescription(response.data.description || "");
          setUploadedImageUrls(
            Array.isArray(response.data.imgUrl)
              ? response.data.imgUrl
              : [response.data.imgUrl]
          );
          setStatus(response.data.status || false);
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
    if (!files || files.length === 0) {
      setUploadedImages([]);
      setUploadedImageUrls(null); 
    } else {
      setUploadedImages(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const advId = id || 1;
      const formData = new FormData();
      if (uploadedImages) {
        uploadedImages.forEach((file) => {
          formData.append("files", file, file.name.replace(/\s+/g, "_"));
        });
        formData.append("imgUrl", JSON.stringify(uploadedImageUrls));
      } else {
        formData.append("imgUrl", null); 
      }
      formData.append("description", description);
      formData.append("status", status);

      const response = await post(`${API.teacherAdv}/${advId}`, formData, true);

      if ([200, 201].includes(response.code)) {
        toast.success(`Teacher Advertisement updated successfully!`);
      } else if (response.code === 400) {
        toast.error(
          "Another advertisement at this level already has status set to true. Please update it first."
        );
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
    <>
      <ToastContainer />
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Teacher Advertisement" />
        <div className="grid grid-cols-5">
          <div className="col-span-5 xl:col-span-12">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
              <form onSubmit={handleSubmit}>
                <div className="grid mb-6 md:grid-cols-2 gap-4">
                  <ImageUploader
                    multiple={false}
                    maxImageSize={{ width: 240, height: 260 }}
                    handleImageChange={handleImageChange}
                    defaultImages={uploadedImageUrls}
                  />
                  <TextAreaField
                    id="teacherDescription"
                    label="Teacher Advertisement Description"
                    placeholder="Enter details about the advertisement..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                    rows={5}
                  />
                </div>
                <div className="flex justify-between">
                  <StatusButton
                    value={status}
                    onValueChange={(value) => setStatus(value)}
                    defaultChecked={false}
                  />
                  <SubmitButton loading={loading} />
                  
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
