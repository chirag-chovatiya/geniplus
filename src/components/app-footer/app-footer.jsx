

export default function AppFooter() {
  
  return (
    <footer className="bg-custom-blue text-white py-5">
      <div className="container mx-auto px-10 flex justify-between items-center border-t border-white-700 pt-6 mt-6 w-auto text-left">
        <p className="capitalize">© 2021 LakshyaAcadamy. All Rights Reserved by PNTEC-LTD</p>
        <div className="flex space-x-4 text-3xl">
          <a href="#" className="text-white">
            <i className="lab la-linkedin-in"></i>
          </a>
          <a href="#" className="text-white">
            <i className="lab la-facebook"></i>
          </a>
          <a href="#" className="text-white">
            <i className="lab la-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
