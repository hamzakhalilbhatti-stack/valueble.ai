import Link from "next/link";
import { Button } from "@/components/ui";
import { getProduct, productOrder } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[70svh] items-center py-24" data-od-id="not-found">
      <div className="atmosphere" />
      <div className="container-site">
        <p className="ui-label text-accent">404</p>
        <h1 className="mt-4 max-w-[16ch] text-display">That page does not exist</h1>
        <p className="mt-6 max-w-[46ch] text-sub text-mute">
          It may have moved, or the link may be wrong. Everything on this site is one click from the home
          page.
        </p>
        <div className="mt-9">
          <Button href="/">Back to home</Button>
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {productOrder.map((s) => {
            const p = getProduct(s)!;
            return (
              <li key={s}>
                <Link href={p.path} className="inline-flex min-h-11 items-center text-mute hover:text-paper">
                  {p.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
