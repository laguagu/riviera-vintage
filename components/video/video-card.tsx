import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useRef, useState } from "react";

interface VideoCardProps {
  title?: string;
  description?: string;
  videoSrc: string;
  posterSrc?: string;
}

export function VideoCard({
  title = "Tervetuloa",
  description = "Katso esittelyvideomme",
  videoSrc,
  posterSrc = "/placeholder.svg?height=315&width=560",
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card className="w-full lg:w-1/2">
      <CardHeader>
        <CardTitle className="text-2xl start">{title}</CardTitle>
        <CardDescription className="text-start">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="aspect-video relative rounded-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            ref={videoRef}
            className="w-full h-full object-cover rounded-xl"
            poster={posterSrc}
          >
            <source src={videoSrc} type="video/mp4" />
            Selaimesi ei tue videotiedostoa.
          </video>
        </div>
      </CardContent>
    </Card>
  );
}
