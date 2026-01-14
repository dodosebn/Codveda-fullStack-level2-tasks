const MockBrowser = () => {
  return (
    <>
      <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 border-b">
        <div className="flex gap-1.5">
          {[
            "h-3 w-3 bg-red-400 rounded-full",
            "h-3 w-3 bg-yellow-400 rounded-full",
            "h-3 w-3 bg-green-400 rounded-full",
          ].map((item, index) => (
            <div key={index} className={item}></div>
          ))}
        </div>
        <div className="flex-1 bg-gray-200 rounded-md px-4 py-1.5 text-sm text-gray-600">
          taskiana.vercel/dashboard
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg w-1/3"></div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="h-6 w-6 rounded-full border-2 border-indigo-300 flex items-center justify-center">
                  {i === 1 && (
                    <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
                <div className="text-sm text-gray-500">Today</div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl"></div>
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gradient-to-b from-purple-50 to-pink-50 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MockBrowser;
