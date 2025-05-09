import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function StudentRootLayout({ children }) {
  return (
    <>
      <DefaultLayout>{children}</DefaultLayout>
    </>
  );
}
