// Centralized types

export type CarCondition = "Foreign Used" | "Nigerian Used" | "Brand New";

export interface Car {
  id: string;
  year: number;
  make: string;
  model: string;
  price: number;
  condition: CarCondition;
  location?: string;
  mileage?: number;
  transmission?: string;
  fuel?: string;
  description?: string | null;
  dealer_name: string;
  dealer_phone: string;
  user_id?: string;
  images: string[];
  video_urls?: string[];
  featured: boolean;
  featured_paid?: boolean;
  featured_until?: string;
  approved: boolean;
  approved_by?: string | null;
  approved_at?: string | null;
  moderation_notes?: string | null;
  approver_email?: string | null;
  status?: string | null;
  state?: string | null;
  city?: string | null;
  views_count?: number;
  created_at?: string;
}

// Additional reusable UI/data types (from upstream snippet)
import type { MouseEventHandler, ButtonHTMLAttributes, ReactNode } from "react";

export interface CarProps {
  city_mpg: number;
  class: string;
  combination_mpg: number;
  cylinders: number;
  displacement: number;
  drive: string;
  fuel_type: string;
  highway_mpg: number;
  make: string;
  model: string;
  transmission: string;
  year: number;
}

export type CarState = CarProps[] & { message?: string };

export interface SearchBarProps {
  setManuFacturer: (manufacturer: string) => void;
  setModel: (model: string) => void;
}

export interface FilterProps {
  manufacturer?: string;
  year?: number;
  model?: string;
  limit?: number;
  fuel?: string;
}

export interface CarCardProps {
  model: string;
  make: string;
  mpg: number;
  transmission: string;
  year: number;
  drive: string;
  cityMPG: number;
}

export interface CustomButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
  btnType?: "button" | "submit";
  containerStyles?: string;
  textStyles?: string;
  title?: string;
  rightIcon?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
}

export interface OptionProps {
  title: string;
  value: string;
}

export interface CustomFilterProps<T> {
  options: OptionProps[];
  setFilter: (selected: T) => void;
}

export interface ShowMoreProps {
  pageNumber: number;
  isNext: boolean;
  setLimit: (limit: number) => void;
}

export interface SearchManuFacturerProps {
  selected: string;
  setSelected: (selected: string) => void;
}

// Component prop types for reuse across the app
export interface ComponentCarCardProps {
  car: Car;
  layout?: "card" | "list";
  variant?: "main" | "collage" | "carousel";
}

export interface ComponentCarCarouselProps {
  cars: Car[];
}

export interface ComponentCarGridProps {
  cars: Car[];
  title?: string;
  subtitle?: string;
}
