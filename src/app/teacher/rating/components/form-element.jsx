"use client";
import React, { useEffect, useState } from "react";
import { InputField } from "@/components/app-inputfield/app-inputfield";
import { SelectField } from "@/components/app-inputfield/app-selectedfield";
import AppModal from "@/components/app-modal/modal.component";
import SubmitButton from "@/components/Button/Submit-button";
import { get, post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRatingAdminStore } from "@/providers/rating-store-provider";

export default function StudentRating({
  handleCloseStudentForm,
  studentRatingObj,
  id = null,
  data = {
    studentName: "",
    studentLevel: "",
    rating: "",
  },
}) {
  const [formData, setFormData] = useState(data);
  const [loading, setLoading] = useState(false);

  const { initialize } = useRatingAdminStore((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await get(`${API.studentRating}/${id}&`);
          if (response.code === 200) {
            setFormData(response.data);
          } else {
            toast.error("Failed to fetch rating data.");
          }
        } catch (error) {
          console.error("Error fetching rating data:", error);
          toast.error("There was an error fetching the data.");
        }
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await post(
        id ? `${API.studentRating}/${id}` : API.studentRating,
        formData
      );
      if (response.code === 201 || response.code === 200) {
        toast.success(`Rating ${id ? "updated" : "submitted"} successfully!`);
        handleCloseStudentForm();
        initialize();
      } else {
        toast.error(response.message || "Failed to submit form.");
      }
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      toast.error("There was an error submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      key="Add Student Rating"
      config={studentRatingObj}
      component={
        <>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <div className="grid mb-6 md:grid-cols-1">
              {/* Student Level Dropdown */}
              <SelectField
                id="studentLevel"
                label="Student Level"
                required={true}
                options={Array.from({ length: 12 }, (_, i) => [
                  { label: `Level ${i + 1}`, value: `${i + 1}` },
                  { label: `Level ${i + 1}A`, value: `${i + 1}A` },
                ]).flat()}
                name="studentLevel"
                value={formData.studentLevel}
                onChange={handleChange}
              />

              {/* Student Name Input */}
              <div className="grid mb-6 md:grid-cols-1 my-6">
                <InputField
                  id="studentName"
                  label="Student Name"
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter Student Name"
                  required
                />
              </div>

              {/* Total Marks Input */}
              <InputField
                id="rating"
                label="Student Rating"
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="Enter Student Rating"
                required
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
