import { format, isToday, isTomorrow, isThisWeek, isYesterday, addDays, startOfDay, endOfDay } from "date-fns";

export const formatDate = (date) => {
  if (!date) return null;
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) return "Today";
  if (isTomorrow(dateObj)) return "Tomorrow";
  if (isYesterday(dateObj)) return "Yesterday";
  if (isThisWeek(dateObj)) return format(dateObj, "EEEE");
  
  return format(dateObj, "MMM d");
};

export const parseNaturalLanguage = (input) => {
  const text = input.toLowerCase().trim();
  
  if (text.includes("today")) {
    return new Date();
  }
  
  if (text.includes("tomorrow")) {
    return addDays(new Date(), 1);
  }
  
  if (text.includes("next week")) {
    return addDays(new Date(), 7);
  }
  
  const dayMatch = text.match(/in (\d+) days?/);
  if (dayMatch) {
    return addDays(new Date(), parseInt(dayMatch[1]));
  }
  
  const weekMatch = text.match(/in (\d+) weeks?/);
  if (weekMatch) {
    return addDays(new Date(), parseInt(weekMatch[1]) * 7);
  }
  
  return null;
};

export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < startOfDay(new Date());
};

export const isUpcoming = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj > endOfDay(new Date());
};