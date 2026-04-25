import { useEffect, useState } from "react";
import {
  Coffee,
  CupSoda,
  Cookie,
  Soup,
  Package,
  CakeSlice
} from "lucide-react";
import api from "../../../api/axios";

// Map category names to icons
const iconMap = {
  all: Package,
  coffee: Coffee,
  drink: CupSoda,
  snacks: Cookie,
  food: Soup,
  dessert: CakeSlice
};

export default function CategoryTabs({ selected, onSelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("/categories") // use your axios instance
      .then((res) => {
        const mapped = res.data.map((cat) => ({
          id: cat.category_name.toLowerCase(),
          name: cat.category_name,
          description: cat.description,
          icon: iconMap[cat.category_name.toLowerCase()] || Package
        }));
        setCategories(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const Icon = category.icon;

        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`
              flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all
              border
              ${
                selected === category.id
                  ? "bg-amber-800 text-white shadow-md border-stone-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-200 border-gray-200"
              }
            `}
            title={category.description} // hover shows description
          >
            <Icon className="w-4 h-4" />
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
