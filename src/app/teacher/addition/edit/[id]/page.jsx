"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React from "react";
import FormElementStudent from "../../components/form-element";

export default function StudentEdit() {
  return (
    <>
      <div>
        <Breadcrumb pageName={`Student/edit/1`} title={`Edit Student`} />
        <FormElementStudent/>
      </div>
    </>
  );
}
