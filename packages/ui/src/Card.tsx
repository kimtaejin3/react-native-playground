import { View, type StyleProp, type ViewStyle } from "react-native";
import type { ReactNode } from "react";

export type CardProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, className, style }: CardProps) {
  return (
    <View
      style={style}
      className={`rounded-xl bg-white p-4 shadow-sm shadow-black/10 ${className ?? ""}`}
    >
      {children}
    </View>
  );
}
