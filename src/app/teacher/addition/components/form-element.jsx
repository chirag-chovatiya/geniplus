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
import { useTestAdminStore } from "@/providers/test-store-provider";

export default function FormStudentAddition({
  handleCloseStudentForm,
  studentAdditionObj,
  id = null,
  data = {
    level: 0,
    totalQuestion: 0,
    status: false,
    additionSettings: {
      horizontalDigits: 0,
      verticalDigits: 0,
      totalQuestion: 0,
      pointFlag: false,
    },
    subtractionSettings: {
      horizontalDigits: 0,
      subDigits: 0,
      totalQuestion: 0,
      pointFlag: false,
    },
    multiplicationSettings: {
      horizontalDigits: 0,
      subDigits: 0,
      totalQuestion: 0,
      pointFlag: false,
    },
    divisionSettings: {
      horizontalDigits: 0,
      subDigits: 0,
      totalQuestion: 0,
      pointFlag: false,
    },
    abacusFlag: [],
    repeatFlag: false,
  },
}) {
  const [formData, setFormData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [visibleFields, setVisibleFields] = useState([]);

  const { initialize } = useTestAdminStore((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await get(`${API.getAllTest}/${id}&`);
          if (response.code === 200) {
            const apiData = response.data;

            const updatedFormData = {
              ...data,
              ...apiData,
              level: apiData.level || 0,
              repeatFlag: apiData.repeatFlag || false,
              abacusFlag: apiData.abacusFlag || [],
            };

            setFormData(updatedFormData);
            setVisibleFields([
              "addition",
              "subtraction",
              "multiplication",
              "division",
            ]);
          } else {
            toast.error("Failed to fetch test data.");
          }
        } catch (error) {
          console.error("Error fetching test data:", error);
          toast.error("There was an error fetching the data.");
        }
      }
    };
    fetchData();
  }, [id]);

  const handleToggleField = (type) => {
    setVisibleFields((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    let parsedValue = value === "" ? "" : parseInt(value);
    if (name !== "totalQuestion") {
      if (parsedValue < 0) parsedValue = 0;
      if (parsedValue > 10) parsedValue = 10;
    }
    setFormData((prevData) => ({
      ...prevData,
      [`${type}Settings`]: {
        ...prevData[`${type}Settings`],
        [name]: parsedValue,
      },
    }));
  };

  const handleAbacusFlagChange = (type, checked) => {
    setFormData((prevData) => {
      let updatedAbacusFlag = [...prevData.abacusFlag];
      if (checked) {
        if (!updatedAbacusFlag.includes(type)) {
          updatedAbacusFlag.push(type);
        }
      } else {
        updatedAbacusFlag = updatedAbacusFlag.filter((item) => item !== type);
      }
      return { ...prevData, abacusFlag: updatedAbacusFlag };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      for (let type of visibleFields) {
        const total = formData[`${type}Settings`].totalQuestion;
        if (!total || total <= 0) {
          toast.error(`Total questions for ${type} must be greater than 0.`);
          return;
        }
      }
    }
    setLoading(true);
    try {
      const response = await post(
        id ? `${API.getAllTest}/${id}` : API.getAllTest,
        formData
      );
      if ([200, 201].includes(response.code)) {
        toast.success("Form submitted successfully!");
        handleCloseStudentForm();
        initialize();
      } else if (response.code === 400) {
        toast.error(
          "Another Test at this level already has status set to true. Please update it first."
        );
      } else {
        toast.error(response.message || "Failed to submit form.");
      }
    } catch (error) {
      console.log(error);
      console.error("There was an error submitting the form:", error);
      toast.error("There was an error submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      key="Add Student Test"
      config={studentAdditionObj}
      component={
        <>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-12 gap-6 mb-6 align-items-center">
              <div className="col-span-6">
                <SelectField
                  id="studentLevel"
                  label="Student Level"
                  required={true}
                  options={Array.from({ length: 12 }, (_, i) => [
                    { label: `Level ${i + 1}`, value: `${i + 1}` },
                    { label: `Level ${i + 1}A`, value: `${i + 1}A` },
                  ]).flat()}
                  name="level"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      level: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="test"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Repeat Test Calculation
                </label>
                <input
                  id="hasFlag"
                  type="checkbox"
                  className="mr-2"
                  name="repeatFlag"
                  checked={formData.repeatFlag}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      repeatFlag: e.target.checked,
                    }))
                  }
                />
                <span className="text-gray-700">
                  Enable multiple test attempts
                </span>
              </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2">
              {["addition", "subtraction", "multiplication", "division"].map(
                (type) => (
                  <div key={type}>
                    <div className="flex items-center justify-between">
                      <label className="text-gray-700 capitalize">{type}</label>
                      <button
                        type="button"
                        onClick={() => handleToggleField(type)}
                        className="bg-custom-blue text-white px-2 py-1 rounded"
                      >
                        {visibleFields.includes(type) ? "Remove" : "Add"} +
                      </button>
                    </div>
                    {visibleFields.includes(type) && (
                      <div className="mt-4 grid gap-4">
                        <InputField
                          id={`${type}RowDigits`}
                          label={`Row Digits For ${type}`}
                          type="number"
                          required={!id}
                          name="horizontalDigits"
                          value={formData[`${type}Settings`].horizontalDigits}
                          onChange={(e) => handleChange(e, type)}
                          placeholder="Enter number of rows"
                          min="0"
                          max="10"
                        />
                        {type === "addition" && (
                          <InputField
                            id={`${type}ColDigits`}
                            label={`Column Digits For ${type}`}
                            type="number"
                            name="verticalDigits"
                            value={formData[`${type}Settings`].verticalDigits}
                            onChange={(e) => handleChange(e, type)}
                            placeholder="Enter number of columns"
                            min="0"
                            max="10"
                          />
                        )}
                        {(type === "subtraction" ||
                          type === "multiplication" ||
                          type === "division") && (
                          <InputField
                            id={`${type}SubDigits`}
                            label={`Sub Digits For ${type}`}
                            type="number"
                            name="subDigits"
                            value={formData[`${type}Settings`].subDigits}
                            onChange={(e) => handleChange(e, type)}
                            placeholder="Enter sub digits"
                            min="0"
                            max="10"
                          />
                        )}
                        <InputField
                          id={`${type}TotalQuestion`}
                          label={`Total Questions For ${type}`}
                          type="number"
                          name="totalQuestion"
                          value={formData[`${type}Settings`].totalQuestion}
                          onChange={(e) => handleChange(e, type)}
                          placeholder="Enter total questions"
                          required={!id}
                        />
                        <div className="flex items-center w-full">
                          <div className="flex-1">
                            <SelectField
                              id={`${type}PointFlag`}
                              name="pointFlag"
                              label={`Points for ${type}`}
                              value={formData[`${type}Settings`].pointFlag}
                              options={[
                                { label: "1 Point", value: 1 },
                                { label: "2 Points", value: 2 },
                              ]}
                              onChange={(e) =>
                                setFormData((prevData) => ({
                                  ...prevData,
                                  [`${type}Settings`]: {
                                    ...prevData[`${type}Settings`],
                                    pointFlag: parseInt(e.target.value),
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${type}AbacusFlag`}
                            name="abacusFlag"
                            checked={formData.abacusFlag.includes(type)}
                            onChange={(e) =>
                              handleAbacusFlagChange(type, e.target.checked)
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`${type}AbacusFlag`}
                            className="text-gray-700"
                          >
                            Abacus display in {type}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
            <SubmitButton loading={loading} />
          </form>
        </>
      }
      onCloseModal={handleCloseStudentForm}
    />
  );
}
