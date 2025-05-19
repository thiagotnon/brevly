import { env } from "@/env";

type ShortenedLinkProps = {
  shortened: string;
  original: string;
};

export function ShortenedLink({ shortened, original }: ShortenedLinkProps) {
  return (
    <div className="flex flex-col">
      <a
        href={`${env.VITE_FRONTEND_URL}/${shortened}`}
        className="font-semibold text-md text-primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        {`${env.VITE_FRONTEND_URL}/${shortened}`}
      </a>
      <span className="text-muted-foreground text-sm">{original}</span>
    </div>
  );
}
