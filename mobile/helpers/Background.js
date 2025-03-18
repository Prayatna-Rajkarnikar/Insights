import { View } from "react-native";

const Background = ({ children, className = "" }) => {
  return (
    <View className={`bg-primaryBlack flex-1 px-5 ${className}`}>
      {children}
    </View>
  );
};

export default Background;
