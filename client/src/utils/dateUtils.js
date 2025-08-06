import { format, parseISO } from "date-fns";

export const formatExactDate = (isoDateString) => {
  const date = parseISO(isoDateString);
  return format(date, "MMM d, yyyy h:mm a");
};
