import { CardContent } from "../ui/card";
import { LoadingCarousel } from "./loading-carousel";

export default function SmallLoadingCarousel() {
  const carouselItems = [
    {
      text: "Tervetuloa tutustumaan Antiikki Avustajaan",
      image: "/file-selection.png",
      type: "image" as const,
    },
    {
      text: "Tekoälyn avulla voit tutkia antiikkiesineitä",
      image: "/file-selection.png",
      type: "image" as const,
    },
    {
      text: "Katso esittelyvideo sovelluksen toiminnasta",
      video: "/demo.mp4",
      type: "video" as const,
    },
  ];

  return (
    <div className="w-full ">
      <CardContent>
        <LoadingCarousel
          tips={carouselItems}
          autoplayInterval={5000}
          showNavigation={false}
          backgroundTips={true}
          aspectRatio="video"
          className="lg:min-h-[350px] xl:min-h-[400px]"
        />
      </CardContent>
    </div>
  );
}
