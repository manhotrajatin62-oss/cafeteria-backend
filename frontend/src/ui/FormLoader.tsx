const FormLoader = () => {
  return (
    <section className="flex absolute top-0 left-0 right-0 bottom-0 z-99 items-center justify-center bg-black/50">
      <div className="flex flex-row gap-2">
        <div className="bg-orange h-6 w-6 animate-bounce rounded-full"></div>
        <div className="bg-orange h-6 w-6 animate-bounce rounded-full [animation-delay:-.3s]"></div>
        <div className="bg-orange h-6 w-6 animate-bounce rounded-full [animation-delay:-.5s]"></div>
      </div>
    </section>
  );
};

export default FormLoader;
