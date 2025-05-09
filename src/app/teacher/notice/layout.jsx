import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { NoticeStoreProvider } from "@/providers/notice-store-provider";

export default function StudentRootLayout({ children }) {
  return (
    <>
      <NoticeStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </NoticeStoreProvider>
    </>
  );
}
