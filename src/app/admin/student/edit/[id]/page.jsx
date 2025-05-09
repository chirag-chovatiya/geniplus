"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, { useEffect, useState } from "react";
import FormElementStudent from "../../components/form-element";
import { API } from "@/service/constant/api-constant";
import { get, post } from "@/service/api";
import { toast } from "react-toastify";
import { useUserAdminStore } from "@/providers/user-store-provider";
import { useRouter } from "next/navigation";

export default function StudentEdit({ params }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    level: 0,
    user_type: "",
    status: false,
    teacherId:null,
    teacher_permission: [],
  });
  const router = useRouter();
  const { initialize } = useUserAdminStore((state) => state);

  useEffect(() => {
    const studentData = async () => {
      try {
        const response = await get(API.getAllUser + `/${params.id}`);
        console.log(response)
        if (response.code == 200 && response.data && response.data) {
          setFormData({
            ...response.data,
            teacher_permission: response.data.teacher_permission 
            ? JSON.parse(response.data.teacher_permission) 
            : [],
          });
        }
      } catch (error) {
        console.error("There was an error geting data:", error);
        toast.error(
          "Error getting data. Please try again or refresh the page."
        );
      }
    };
    studentData();
  }, []);
  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    try {
      const response = await post(API.getAllUser + `/${params.id}`, formData);
      if (response) {
        router.replace("/admin/student");
        initialize();
      }
      return response;
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      toast.error("Error submitting form. Please try again.");
      return error;
    }
  };
  return (
    <>
      <div>
        <Breadcrumb pageName={`Student/edit - ${params.id}`} title={`Edit Student`} />
        <FormElementStudent
          data={formData}
          handleSubmit={handleSubmit}
          isEditMode={true}
        />
      </div>
    </>
  );
}
