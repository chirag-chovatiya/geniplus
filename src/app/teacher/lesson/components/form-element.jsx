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
import { useLessonAdminStore } from "@/providers/lesson-store-provider";
import { TextAreaField } from "@/components/app-inputfield/app-textarea";
import StatusButton from "@/components/Switchers/StatusButton";

export default function StudentLesson({
  handleCloseStudentForm,
  studentLessonObj,
  id = null,
  data = {
    studentLevel: 0,
    description: null,
    status: false,
    excelLink: null,
    linkStatus: false,
  },
}) {
  const [formData, setFormData] = useState(data);
  const [loading, setLoading] = useState(false);

  const { initialize } = useLessonAdminStore((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await get(`${API.stdLesson}/${id}`);
          if (response.code === 200) {
            setFormData(response.data);
          } else {
            toast.error("Failed to fetch lesson data.");
          }
        } catch (error) {
          console.error("Error fetching lesson data:", error);
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
        id ? `${API.stdLesson}/${id}` : API.stdLesson,
        formData
      );
      if (response.code === 201 || response.code === 200) {
        toast.success(`Lesson ${id ? "updated" : "submitted"} successfully!`);
        handleCloseStudentForm();
        initialize();
      } else if (response.code === 400) {
        toast.error(
          `Another lesson at level ${formData.studentLevel} already has status set to true. Please update it first.`
        );
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
      key="Add Student Test"
      config={studentLessonObj}
      component={
        <>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-1">
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
              <div className="grid md:grid-cols-1 my-6">
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

                <TextAreaField
                  id="studentExlecLink"
                  label="Student Lesson Excel Link"
                  required={true}
                  placeholder="Enter details about the link..."
                  value={formData.excelLink}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      excelLink: e.target.value,
                    }))
                  }
                  name="excelLink"
                  rows={2}
                />
                {/* <div className="col-span-12 md:col-span-2 flex flex-col md:items-end">
                    <label
                      htmlFor="linkStatus"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Link Status
                    </label>
                    <StatusButton
                      value={formData.linkStatus}
                      onValueChange={(value) =>
                        setFormData({ ...formData, linkStatus: value })
                      }
                      defaultChecked={formData.linkStatus}
                    />
                  </div> */}
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
