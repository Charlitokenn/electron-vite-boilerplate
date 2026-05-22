import {ComponentType } from "react";
import type {LucideIcon} from "lucide-react";

export interface NavItem {
  title: string
  url: string
  component?: ComponentType
}

export interface NavSection {
  title: string
  url: string
  icon: LucideIcon
  component?: ComponentType
  items?: NavItem[]
}
