import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { TestStoreProvider } from "@/providers/test-store-provider";


export default function StudentRootLayout({ children }) {
  return (
    <>
      <TestStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </TestStoreProvider>
    </>
  );
}
