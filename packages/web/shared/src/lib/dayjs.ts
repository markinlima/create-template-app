import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

/** `dayjs` with the `relativeTime` plugin and the `pt-br` locale already set. */
export { dayjs };
