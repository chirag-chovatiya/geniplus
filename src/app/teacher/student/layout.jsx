import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { UserStoreProvider } from "@/providers/user-store-provider";

export default function StudentRootLayout({ children }) {
  return (
    <>
      <UserStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </UserStoreProvider>
    </>
  );
}
