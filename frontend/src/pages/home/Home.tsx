import { useEffect, useState } from "react";
import { BsFillCupHotFill } from "react-icons/bs";
import { GiHotMeal } from "react-icons/gi";
import { IoFastFood } from "react-icons/io5";
import { useUser } from "../../store/useUser";
import ImageCarousel from "./ImageCarousel";
import CategoryCard from "../../components/CategoryCard";
import ProductCard from "../../components/ProductCard";
import { getTodayMenu } from "../../api/menuApi.ts";
import Loader from "../../ui/Loader.tsx";

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
  const { showCart } = useUser();

  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getTodayMenu();

        const data = res.data.data;

        setCategories(data);

        if (data.length > 0) {
          setActiveCategory(data[0]);
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

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
            <div
              className={`${showCart ? "mx-10" : "mx-0"} flex flex-wrap items-center gap-6`}
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
                <ProductCard key={item._id} item={item} />
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
