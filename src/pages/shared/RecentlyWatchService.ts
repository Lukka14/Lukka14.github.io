import { Media } from "../../models/Movie";

export const saveRecentlyWatched = (newMedia: Media): void => {

  const maxCapacity = 5;

  const items: Media[] = getRecentlyWatched();

  // Remove any existing instance of the same Media (if applicable)
  const updatedItems = items.filter(item => item.id !== newMedia.id);

  // Add the new Media object at the beginning
  updatedItems.unshift(newMedia);

  // Enforce the maximum capacity
  if (updatedItems.length > maxCapacity) {
    updatedItems.pop(); // Remove the last item if the list exceeds the capacity
  }

  // Save the updated list back to localStorage
  localStorage.setItem("recentlyWatched", JSON.stringify(updatedItems));
};


export const getRecentlyWatched = (): Media[] => {
  const items = JSON.parse(localStorage.getItem("recentlyWatched") || "[]");
  
  // Map items to instances of the Media class
  return items.map((item: any) => new Media(item));
};