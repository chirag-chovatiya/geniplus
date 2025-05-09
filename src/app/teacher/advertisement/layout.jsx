import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { TeacherAdvStoreProvider } from "@/providers/teacheradv-store-provider";

export default function StudentRootLayout({ children }) {
  return (
    <>
      <TeacherAdvStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </TeacherAdvStoreProvider>
    </>
  );
}
