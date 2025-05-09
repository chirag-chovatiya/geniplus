import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ReportStoreProvider } from "@/providers/report-store-provider";

export default function StudentRootLayout({ children }) {
  return (
    <>
      <ReportStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </ReportStoreProvider>
    </>
  );
}
