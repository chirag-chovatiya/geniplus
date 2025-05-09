import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { TeacherListStoreProvider } from "@/providers/teacherlist-store-provider";

export default function StudentRootLayout({ children }) {
  return (
    <>
      <TeacherListStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </TeacherListStoreProvider>
    </>
  );
}
