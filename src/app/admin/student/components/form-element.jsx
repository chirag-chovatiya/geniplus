import { SelectField } from "@/components/app-inputfield/app-selectedfield";
import AppModal from "@/components/app-modal/modal.component";
import SubmitButton from "@/components/Button/Submit-button";
import StatusButton from "@/components/Switchers/StatusButton";
import { useUserAdminStore } from "@/providers/user-store-provider";
import { get, post } from "@/service/api";
import { API } from "@/service/constant/api-constant";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FormElementStudent({
  handleCloseStudentForm,
  studentRegisterObj,
  id = null,
  data = {
    name: "",
    email: "",
    password: "",
    level: "",
    user_type: "",
    status: true,
  },
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(data);
  const [teachers, setTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState("");
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

    const { initialize } = useUserAdminStore((state) => state);
  

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await get(API.getAllUser);
        if (response.code === 200 && response.data) {
          const filteredTeachers = response.data.filter(
            (user) => user.user_type === "Teacher"
          );
          setTeachers(filteredTeachers);
          if (data.teacherId) {
            const teacher = filteredTeachers.find(
              (teacher) => teacher.id === data.teacherId
            );
            if (teacher) {
              setTeacherName(teacher.name);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers()
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const userTypeOptions = [
    { label: "Student", value: "Student" },
    { label: "Admin", value: "Admin" },
    { label: "Teacher", value: "Teacher" },
  ];
  const teacherPermissionOptions = [
    { label: "All Permission", value: "AllPermission" },
    { label: "Student create", value: "StudentCreate" },
    { label: "Student delete", value: "StudentDelete" },
    { label: "Student edit", value: "StudentEdit" },
  ];

  const handlePermissionChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      teacher_permission: Array.isArray(prevFormData.teacher_permission)
        ? [...new Set([...prevFormData.teacher_permission, ...selectedOptions])]
        : selectedOptions,
    }));
  };

  const handleRemovePermission = (permissionToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      teacher_permission: Array.isArray(prevFormData.teacher_permission)
        ? prevFormData.teacher_permission.filter(
            (permission) => permission !== permissionToRemove
          )
        : [],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await get(API.getAllUser + `/${id}`);
          if (response.code == 200 && response.data && response.data) {
            setIsPasswordEditable(false);
            setFormData({
              ...response.data,
              teacher_permission: response.data.teacher_permission
                ? JSON.parse(response.data.teacher_permission)
                : [],
            });
          }
        } catch (error) {
          console.error("Error fetching lesson data:", error);
          toast.error(
            "Error getting data. Please try again or refresh the page."
          );
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
        id ? `${API.getAllUser}/${id}` : API.getAllUser,
        formData
      );
      if (response.code === 201 || response.code === 200) {
        toast.success(`Student ${id ? "updated" : "submitted"} successfully!`);
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
      key="Add Student Test"
      config={studentRegisterObj}
      component={
        <>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              {[
                {
                  label: "Full Name",
                  name: "name",
                  type: "text",
                  placeholder: "John",
                },
                {
                  label: "Email address",
                  name: "email",
                  type: "email",
                  placeholder: "john.doe@company.com",
                },
              ].map((input, idx) => (
                <div key={idx}>
                  <label
                    htmlFor={input.name}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {input.label}
                  </label>
                  <input
                    {...input}
                    value={formData[input.name] || ""}
                    onChange={handleChange}
                    className="p-2 bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded w-full"
                    required
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="studentlevel"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Student Level
                </label>
                <select
                  name="level"
                  value={formData.level || ""}
                  onChange={handleChange}
                  className="p-2 bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded w-full"
                >
                  <option value="" disabled>
                    Select a level
                  </option>
                  {[...Array(12)].flatMap((_, i) => [
                    <option key={`${i + 1}`} value={`${i + 1}`}>
                      Level {i + 1}
                    </option>,
                    <option key={`${i + 1}A`} value={`${i + 1}A`}>
                      Level {i + 1}A
                    </option>,
                  ])}
                </select>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className="p-2 bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded w-full"
                    required={!id || isPasswordEditable}
                    placeholder="•••••••••"
                    disabled={id && !isPasswordEditable}
                    onBlur={() => setIsPasswordEditable(false)}
                  />
                  {id && !isPasswordEditable && (
                    <button
                      type="button"
                      className="ml-2 px-3 py-1 bg-custom-blue text-white rounded"
                      onClick={() => setIsPasswordEditable(true)}
                    >
                      <span className="text-xl">+</span>
                    </button>
                  )}
                </div>
              </div>
              <SelectField
                id="userType"
                label="User Type"
                options={userTypeOptions}
                value={formData.user_type || ""}
                onChange={(e) =>
                  setFormData({ ...formData, user_type: e.target.value })
                }
                required={true}
              />
              <SelectField
                id="AllTeacher"
                label="Teacher Name"
                options={teachers.map((teacher) => ({
                  label: teacher.name,
                  value: teacher.id,
                }))}
                value={formData.teacherId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, teacherId: e.target.value })
                }
              />
              <div>
                <SelectField
                  id="teacher_permission"
                  label="Teacher Permission"
                  options={teacherPermissionOptions}
                  value={formData.teacher_permission || ""}
                  onChange={handlePermissionChange}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {(Array.isArray(formData.teacher_permission)
                    ? formData.teacher_permission
                    : []
                  ).map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {permission}
                      <button
                        type="button"
                        onClick={() => handleRemovePermission(permission)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Status
                </label>
                <StatusButton
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                  defaultChecked={formData.status}
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
