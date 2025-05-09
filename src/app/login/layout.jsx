export default function AuthLayout({ children }) {
  
    return (
      <>
        <meta name="robots" content="index, follow" />
  
        <div className="h-full bg-white flex items-center justify-center">
          <div className="flex flex-col items-center">
            
            {children}
          </div>
        </div>
      </>
    );
  }
  