const Loader = () => {

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        <div className="h-15 w-15 animate-spin rounded-full border-6 border-orange border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"/>

      <span className="font-semibold text-sm">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
