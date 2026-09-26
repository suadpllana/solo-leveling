import { Brain, Coins, Compass, Gift, Swords, createLucideIcon } from "lucide-react";

// Lucide's own "cross" is a symmetric plus; draw a Latin cross in the same
// stroke style for the Religion path.
const LatinCross = createLucideIcon("latin-cross", [
  ["path", { d: "M10 2.5h4V7h4.5v4H14v10.5h-4V11H5.5V7H10z", key: "latin-cross" }],
]);

const ICONS = {
  religion: LatinCross,
  money: Coins,
  mind: Brain,
  body: Swords,
  wishlist: Gift,
};

// The emblem icon for a path (category) id. Falls back to a compass.
export default function PathIcon({ id, ...props }) {
  const Icon = ICONS[id] ?? Compass;
  return <Icon aria-hidden="true" {...props} />;
}
