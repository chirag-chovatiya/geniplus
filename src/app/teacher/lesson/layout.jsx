import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { LessonStoreProvider } from "@/providers/lesson-store-provider";

export default function StudentRootLayout({ children }) {
  return (
    <>
      <LessonStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </LessonStoreProvider>
    </>
  );
}
