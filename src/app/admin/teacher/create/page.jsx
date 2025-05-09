"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FormElementStudent from "../components/form-element";
import { useRouter } from "next/navigation";
import { post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { useUserAdminStore } from "@/providers/user-store-provider";
import { hasPermission } from "@/utils/permissions";

export default function StudentCreate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    level: 0,
    user_type: "",
    status: true,
    teacherId:null,
    teacher_permission: [],
  });
  const router = useRouter();
  const { initialize } = useUserAdminStore((state) => state);

  const hasCreatePermission = hasPermission("StudentCreate");

  if (!hasCreatePermission) {
    useEffect(() => {
      router.replace("/admin");
    }, [router]);
    return null; 
  }



  const handleSubmit = async (e, data) => {
    e.preventDefault();
    try {
      const response = await post(API.getAllUser, data || formData);
      if (response.code === 201 || response.code === 200) {
        router.replace("/admin/student");
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
