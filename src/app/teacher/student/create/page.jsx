"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FormElementStudent from "../components/form-element";
import { useRouter } from "next/navigation";
import { post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { useUserAdminStore } from "@/providers/user-store-provider";

export default function StudentCreate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    level: 0,
    user_type: "",
    status: true,
  });
  const router = useRouter();
  const { initialize } = useUserAdminStore((state) => state);
  const handleSubmit = async (e, data) => {
    e.preventDefault();
    try {
      const response = await post(API.getAllUser, data || formData);
      if (response.code === 201 || response.code === 200) {
        router.replace("/teacher/student");
        initialize();
      }
    } catch (error) {
      console.error("There was an error submitting the form:", error);
    }
  };
  return (
    <div className="">
      <Breadcrumb pageName="Student/create" title="Register New Student" />
      <FormElementStudent data={formData} handleSubmit={handleSubmit} />
    </div>
  );
}
