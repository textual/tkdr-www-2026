import AppInfoComponent from "@/components/home/appInfo";
import { LocationBanner } from "@/components/home/locationBanner";

export default function Home() {
  return (
    <div className="p-4">
      <div>home page</div>
      <AppInfoComponent />
      <LocationBanner mode={"raw"} />
    </div>
  );
}
