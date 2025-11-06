import { Redirect } from 'expo-router';

export default function OrdersTab() {
  // Go to the tabs group root and pass the section
  return <Redirect href="/(tabs)?section=products" />;
}
