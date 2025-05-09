import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ResultStoreProvider } from "@/providers/result-store-provider";

export default function StudentRootLayout({ children }) {
  return (
    <>
      <ResultStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </ResultStoreProvider>
    </>
  );
}
