import { useEffect, useRef, useState } from "react";
import { BsFillCupHotFill } from "react-icons/bs";
import { GiHotMeal } from "react-icons/gi";
import { IoFastFood } from "react-icons/io5";
import { useUser } from "../../store/useUser";
import ImageCarousel from "./ImageCarousel";
import CategoryCard from "../../components/CategoryCard";
import ProductCard from "../../components/ProductCard";
import { getTodayMenu } from "../../api/menuApi.ts";
import Loader from "../../ui/Loader.tsx";
import { getCart } from "../../api/cartApi.ts";
import toast from "react-hot-toast";
import Team from "../about us/Team.tsx";
import { ImArrowLeft2, ImArrowRight2 } from "react-icons/im";

const categoryIcons: Record<string, any> = {
  Breakfast: BsFillCupHotFill,
  Lunch: GiHotMeal,
  Snacks: IoFastFood,
};

function formatTime(time: string) {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHour = (hours % 12 || 12).toString().padStart(2, "0");

  return `${formattedHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

const Home = () => {
  const { showCart, setCartItems } = useUser();

  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = categories.findIndex((c)=>{
    return c._id === activeCategory?._id
  })

  const scrollToCard = (direction : 'left' | 'right') => {

    if(categories.length == 0) return;

    let index = activeIndex;
    
    if(direction == 'right'){
      index = (index + 1) % categories.length;
    }else{
      index = (index - 1 + categories.length) % categories.length;
    }

    const nextCategory = categories[index];

    setActiveCategory(nextCategory);

    const container = scrollContainerRef.current;

    if(!container) return;

    (container.children[index] as HTMLButtonElement)?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [menuResult, cartResult] = await Promise.allSettled([
        getTodayMenu(),
        getCart(),
      ]);

      // Menu response
      if (menuResult.status === "fulfilled") {
        const menuData = menuResult.value.data.data;

        setCategories(menuData);

        if (menuData.length > 0) {
          setActiveCategory(menuData[0]);
        }
      } else {
        toast.error(
          menuResult?.reason?.response?.data?.message ||
            "Error occurred while fetching menu",
        );
      }

      // Cart response
      if (cartResult.status === "fulfilled") {
        setCartItems(cartResult.value.data.data.items);
      } else {
        toast.error(
          cartResult.reason?.response?.data?.message ||
            "Error occurred while fetching cart",
        );
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      const isScrollable =
        scrollContainer.scrollWidth > scrollContainer.clientWidth;

      if (!isScrollable) return;

      const scrollValue =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      scrollContainer.scrollLeft += scrollValue;

      e.preventDefault();
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, [scrollContainerRef.current]);

  useEffect(()=>{
    const container = scrollContainerRef.current;

    if(!container) return;
      const checkScrollable = ()=>{

    setIsScrollable(container.scrollWidth > container.clientWidth)
  }

  checkScrollable();

  const observer = new ResizeObserver(checkScrollable);

  observer.observe(container);

    return ()=> observer.disconnect()
  },[categories])

  return (
    <section className="flex flex-col items-center">
      <ImageCarousel />

      <h1 className="my-20 text-4xl font-bold">
        Today's <span className="text-orange">Menu</span>
      </h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* CATEGORY CARDS */}

          {categories.length === 0 ? (
            <p className="my-20 text-gray-500">No categories available</p>
          ) : (
           <div className="flex items-center gap-4 max-w-[90%]">
           {isScrollable && <button className="carousel-btn" onClick={()=>scrollToCard('left')}><ImArrowLeft2 color="white" size={20} /></button>}
             <div
              ref={scrollContainerRef}
              className={`${showCart ? "mx-10" : "mx-0"} flex items-center gap-6 overflow-x-scroll`}
            >
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.name];

                return (
                  <CategoryCard
                    key={cat._id}
                    icon={Icon}
                    title={cat.name}
                    active={activeCategory?._id === cat._id}
                    onClick={() => setActiveCategory(cat)}
                  />
                );
              })}
            </div>
          {isScrollable &&  <button className="carousel-btn" onClick={()=>scrollToCard('right')}><ImArrowRight2 color="white" size={20} /></button>}
           </div>
          )}

          {/* CATEGORY HEADER */}

          {activeCategory && (
            <div className="mt-10 flex w-250 items-center justify-between">
              <h1 className="flex flex-col text-3xl font-semibold">
                {activeCategory.name}
                <span className="text-sm text-gray-400">
                  Click items to add in the cart
                </span>
              </h1>

              <p className="text-gray-500">
                Timing : {formatTime(activeCategory.startTime)} -{" "}
                {formatTime(activeCategory.endTime)}
              </p>
            </div>
          )}

          {/* PRODUCT GRID */}

          <div className="my-10 grid grid-cols-4 gap-6 px-6">
            {activeCategory?.items?.length === 0 ? (
              <p className="col-span-4 my-20 text-center text-gray-500">
                No items available for today
              </p>
            ) : (
              activeCategory?.items?.map((item: any) => (
                <ProductCard
                  key={item._id}
                  categoryId={activeCategory._id}
                  item={item}
                />
              ))
            )}
          </div>
        </>
      )}

      <Team />
    </section>
  );
};

export default Home;
