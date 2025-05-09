export default function LoginBtn({ loading }) {
  return (
    <button
      type="submit"
      className="w-full py-2 bg-custom-blue text-white font-semibold rounded-md focus:ring-2 focus:outline-none disabled:opacity-75"
      disabled={loading}
    >
      {loading ? "Loading..." : "Log In"}
    </button>
  );
}