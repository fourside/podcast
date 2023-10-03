import dayjs from "dayjs";

export function formatRfc822(date: Date): string {
  return dayjs(date).format("ddd, DD MMM YYYY HH:mm:ss ZZ");
}
