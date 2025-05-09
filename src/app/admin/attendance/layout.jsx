import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { AttendanceStoreProvider } from "@/providers/attendance-store-provider";

export default function StudentRootLayout({ children }) {
  return (
    <>
      <AttendanceStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </AttendanceStoreProvider>
    </>
  );
}
