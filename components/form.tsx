import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Form({
  action,
  children,
}: {
  action: any;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="flex flex-col space-y-4 px-4 sm:px-16">
      <div className="grid gap-2">
        <Label htmlFor="email">Sähköpostiosoite</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="nimi@esimerkki.fi"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Salasana</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {children}
    </form>
  );
}
