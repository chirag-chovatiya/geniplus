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
import { TextAreaField } from "@/components/app-inputfield/app-textarea";
import { useNoticeAdminStore } from "@/providers/notice-store-provider";

export default function StudentNotice({
  handleCloseStudentForm,
  studentNoticeObj,
  id = null,
  data = {
    studentLevel: 0,
    description: "",
    status: false,
  },
}) {
  const [formData, setFormData] = useState(data);
  const [loading, setLoading] = useState(false);

  const { initialize } = useNoticeAdminStore((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await get(`${API.studentNote}/${id}`);
          if (response.code === 200) {
            setFormData(response.data); 
          } else {
            toast.error("Failed to fetch notice data.");
          }
        } catch (error) {
          console.error("Error fetching notice data:", error);
          toast.error("There was an error fetching the data.");
        }
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await post(
        id ? `${API.studentNote}/${id}` : API.studentNote,
        formData
      );
      if (response.code === 201 || response.code === 200) {
        toast.success(`Notice ${id ? "updated" : "submitted"} successfully!`);
        handleCloseStudentForm();
        initialize();
      }  else if (response.code === 400) {
        toast.error(`Another notice at level ${formData.studentLevel} already has status set to true. Please update it first.`);
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
      key="Add Student Notice"
      config={studentNoticeObj}
      component={
        <>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <div className="grid mb-6 md:grid-cols-1">
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
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    studentLevel: e.target.value,
                  }))
                }
              />
              <div className="grid mb-6 md:grid-cols-1 my-6">
                <TextAreaField
                  id="studentDescription"
                  label="Student Lesson Description"
                  required={true}
                  placeholder="Enter details about the lesson..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      description: e.target.value,
                    }))
                  }
                  name="description"
                  rows={4}
                />
              </div>
            </div>
            <SubmitButton loading={loading} />
          </form>
        </>
      }
      onCloseModal={handleCloseStudentForm}
    />
  );
}
