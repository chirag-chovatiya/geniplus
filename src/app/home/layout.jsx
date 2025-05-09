import AppFooter from "@/components/app-footer/app-footer";
import AppNavbar from "@/components/app-navbar/app-navbar";


export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar />
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}
