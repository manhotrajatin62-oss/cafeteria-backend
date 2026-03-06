const FormLoader = () => {
  return (
    <section className="flex h-dvh absolute z-99 w-dvw items-center justify-center bg-black/50">
      <div className="flex flex-row gap-2">
        <div className="bg-orange h-6 w-6 animate-bounce rounded-full"></div>
        <div className="bg-orange h-6 w-6 animate-bounce rounded-full [animation-delay:-.3s]"></div>
        <div className="bg-orange h-6 w-6 animate-bounce rounded-full [animation-delay:-.5s]"></div>
      </div>
    </section>
  );
};

export default FormLoader;
