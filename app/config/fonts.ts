import { useFonts } from 'expo-font';

export function useAppFonts() {
  return useFonts({
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
  });
}

export default useAppFonts;
