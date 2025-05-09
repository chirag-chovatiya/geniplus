const SubmitButton = ({ loading }) => {
  return (
    <button
      className={`border-2 bg-custom-bg text-custom-blue font-bold py-2 px-5 rounded-full flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      type="submit"
      disabled={loading} 
    >
      {loading ? <h1>Loading...</h1> : <h1>Submit</h1>}
    </button>
  );
};

export default SubmitButton;
