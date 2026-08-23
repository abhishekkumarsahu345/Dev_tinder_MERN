const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-24 text-gray-500">
      <p className="text-4xl font-medium text-violet-500 ">{message}</p>
    </div>
    
  );
};

export default EmptyState;
