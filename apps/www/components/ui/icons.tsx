import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  Hash,
  TrendingUp,
  MessageCircle,
  Users,
  ShieldCheck,
  Briefcase,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Image,
  Edit,
  LogOut,
  UserPlus,
  Send,
  type LucideIcon,
} from "lucide-react";

export type IconName =
  | "home"
  | "search"
  | "bell"
  | "mail"
  | "bookmark"
  | "user"
  | "more-horizontal"
  | "hash"
  | "trending-up"
  | "message-circle"
  | "users"
  | "shield-check"
  | "briefcase"
  | "sparkles"
  | "chevron-left"
  | "chevron-right"
  | "wallet"
  | "image"
  | "edit"
  | "log-out"
  | "user-plus"
  | "send";

export const Icons: Record<IconName, LucideIcon> = {
  home: Home,
  search: Search,
  bell: Bell,
  mail: Mail,
  bookmark: Bookmark,
  user: User,
  "more-horizontal": MoreHorizontal,
  hash: Hash,
  "trending-up": TrendingUp,
  "message-circle": MessageCircle,
  users: Users,
  "shield-check": ShieldCheck,
  briefcase: Briefcase,
  sparkles: Sparkles,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  wallet: Wallet,
  image: Image,
  edit: Edit,
  "log-out": LogOut,
  "user-plus": UserPlus,
  send: Send,
};

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const IconComponent = Icons[name];
  return <IconComponent className={className} />;
}
