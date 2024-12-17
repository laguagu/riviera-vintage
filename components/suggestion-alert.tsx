import { Alert, AlertDescription } from "@/components/ui/alert";
import gsap from "gsap";
import { LightbulbIcon } from "lucide-react";
import { useEffect, useRef } from "react";

const SuggestionAlert = () => {
  const lightbulbRef = useRef(null);
  const alertRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Aloitetaan piilossa
    gsap.set(lightbulbRef.current, {
      scale: 0,
      opacity: 0,
      rotate: -140,
    });

    gsap.set(alertRef.current, {
      opacity: 0,
      y: 20,
    });

    // Sisääntulo-animaatio
    tl.to(alertRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    })
      .to(lightbulbRef.current, {
        scale: 1.2,
        opacity: 1,
        rotate: 30,
        duration: 0.6,
        ease: "back.out(0.3)",
      })
      .to(lightbulbRef.current, {
        rotate: -30,
        duration: 0.6,
        scale: 1,
        ease: "power1.inOut",
      })
      .to(lightbulbRef.current, {
        rotate: 0,
        scale: 1.1,
        duration: 0.8,
        ease: "power1.inOut",
      });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <Alert
      className="mt-1 md:py-1.5 py-1 px-2 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 w-fit mx-auto "
      ref={alertRef}
    >
      <div className="flex items-center gap-1.5">
        <div ref={lightbulbRef} className="origin-center">
          <LightbulbIcon className="h-3 w-3 text-zinc-600 dark:text-zinc-400 flex-shrink-0" />
        </div>
        <AlertDescription className="text-xs tracking-tight md:tracking-normal text-zinc-600 dark:text-zinc-300">
          Voit esimerkiksi kysyä mikä liike myy 20-luvun antiikkia Helsingissä?
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default SuggestionAlert;
