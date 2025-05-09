
export default function HoverButton ()  {
  return (
    <div>
      <div className="relative inline-block text-left">
            <div className="group">
              <button
                type="button"
                className="px-4 py-2 rounded-full text-custom-blue cursor-pointer font-semibold text-sm w-full bg-custom-bg"
              >
                <span className="flex-1 text-left">Language</span>
              </button>
              <div className="hidden group-hover:block absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Option 1
                  </a>
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Option 2
                  </a>
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Option 3
                  </a>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}

