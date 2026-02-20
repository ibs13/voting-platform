export const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-10 rounded shadow text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Vote Recorded Successfully
        </h2>
        <p className="text-gray-600">
          Thank you for participating in the election.
        </p>
      </div>
    </div>
  );
};
