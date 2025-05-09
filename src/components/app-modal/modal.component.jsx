export const DEFAULT_MODAL_CONFIG = {
  visible: false,
  displayHeader: false,
  title: "Default Title",
  displayDefualtBtn: false,
  cancelBtnText: "Decline",
  okBtnText: "Continue",
};

export default function AppModal({
  config = DEFAULT_MODAL_CONFIG,
  onOkBtnClick = () => {
    onCloseModal();
  },
  onCancelBtnClick = () => {
    onCloseModal();
  },
  onCloseModal = () => {},
  component = null,
  isModal = true,
}) {
  if (!isModal) return component;
  return (
    <>
      {config?.visible && (
        <>
          <div
            key="main-div"
            className={
              isModal
                ? "block overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-999 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                : ""
            }
          >
            {/* <--Header section Start --> */}

            <div className="flex items-center justify-center h-full ">
              <div className="relative  w-full max-w-2xl max-h-full">
                <div
                  className={`relative bg-white dark:bg-slate-800 ${
                    isModal ? "shadow  md:rounded-lg" : " border-t"
                  }`}
                >
                  {config.displayHeader ? (
                    <div className="flex items-center justify-between p-3 md:p-3 border-b rounded-t ">
                      <h3 className="text-xl font-medium dark:text-white ">
                        {config.title}
                      </h3>
                      <button
                        onClick={() => {
                          onCancelBtnClick();
                        }}
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                      >
                        <i className="las la-times"></i>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="p-4 md:p-5 space-y-4">
                    {component ? component : ""}
                  </div>
                  {config.displayDefualtBtn ? ( //config.displayDefualtBtn. If true, it renders a flex container with two buttons (OK and Cancel).
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                      <button
                        onClick={() => {
                          onOkBtnClick();
                        }}
                        data-modal-hide="default-modal"
                        type="button"
                        className="text-white bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        {config.okBtnText}
                      </button>
                      <button
                        onClick={() => {
                          onCancelBtnClick();
                        }}
                        data-modal-hide="default-modal"
                        type="button"
                        className="ms-3 text-Gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                      >
                        {config.cancelBtnText}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
          {isModal ? (
            <div className="bg-gray-900/50 fixed inset-0 z-40"></div>
          ) : null}
        </>
      )}
    </>
  );
}
