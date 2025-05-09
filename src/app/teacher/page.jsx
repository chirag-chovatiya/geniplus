import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { TestStoreProvider } from "@/providers/test-store-provider";
import StudentLists from "./student/page";
import { UserStoreProvider } from "@/providers/user-store-provider";
import AdminAdvHomeModel from "./AdvHomeModel";


export default function Home() {
  return (
    <>
      <UserStoreProvider>
        <TestStoreProvider>
          <DefaultLayout>
            <StudentLists />
            <AdminAdvHomeModel/>
          </DefaultLayout>
        </TestStoreProvider>
      </UserStoreProvider>
    </>
  );
}
