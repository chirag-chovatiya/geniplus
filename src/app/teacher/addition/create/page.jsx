"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FormElementStudent from "../components/form-element";
import { post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { useRouter } from "next/navigation";

export default function StudentCreate() {
  const [formData, setFormData] = useState({
    addition: [],
    subtraction: [],
    multiplication: [],
    division: [],
    level: 0,
    totalQuestion: 0,
  });
  const router = useRouter();

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("t");
      const response = await post(API.getAllTest, data || formData, token);
      if (response.code === 201 || response.code === 200) {
        router.replace("/teacher/student");
      }
    } catch (error) {
      console.error("There was an error submitting the form:", error);
    }
  };
  return (
    <div className="">
      <Breadcrumb pageName="Student/create" title="Register New Student" />
      <FormElementStudent data={formData} handleSubmit={handleSubmit}/>
    </div>
  );
}
