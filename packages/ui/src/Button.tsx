import { Pressable, Text, type StyleProp, type ViewStyle } from "react-native";

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, className, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={style}
      className={`items-center justify-center rounded-[10px] bg-[#174ab9] px-5 py-3 active:opacity-70 ${className ?? ""}`}
    >
      <Text className="text-base font-semibold text-white">{title}</Text>
    </Pressable>
  );
}
