import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ImageStoreProvider } from "@/providers/image-store-provider";


export default function StudentRootLayout({ children }) {
  return (
    <>
      <ImageStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </ImageStoreProvider>
    </>
  );
}
