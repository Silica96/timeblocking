export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Timeblocking
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Find the best meeting time through collaborative polling
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
          <p className="mb-4">
            Create a poll with multiple date options and share a unique link with participants.
            No authentication required - just vote and find the best time for everyone.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Create a poll with multiple date options</li>
                <li>Share the generated link with participants</li>
                <li>Participants vote on their available dates</li>
                <li>See results in real-time and find the best date</li>
              </ol>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Create New Poll
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
