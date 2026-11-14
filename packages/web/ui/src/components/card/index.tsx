import { CardAction } from "./components/card-action";
import { CardContent } from "./components/card-content";
import { CardDescription } from "./components/card-description";
import { CardFooter } from "./components/card-footer";
import { CardHeader } from "./components/card-header";
import { CardRoot } from "./components/card-root";
import { CardTitle } from "./components/card-title";

/** A surface that groups a title, content and actions. Use `Card.header`, `Card.title`, `Card.description`, `Card.action`, `Card.content` and `Card.footer`. */
export const Card = Object.assign(CardRoot, {
  header: CardHeader,
  title: CardTitle,
  description: CardDescription,
  action: CardAction,
  content: CardContent,
  footer: CardFooter,
});
