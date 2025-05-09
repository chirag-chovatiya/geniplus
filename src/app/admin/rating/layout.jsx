import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { RatingStoreProvider } from "@/providers/rating-store-provider";

export default function StudentRootLayout({ children }) {
  return (
    <>
      <RatingStoreProvider>
        <DefaultLayout>{children}</DefaultLayout>
      </RatingStoreProvider>
    </>
  );
}
