import { Action, Container, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center pt-32 pb-24">
      <Container>
        <Eyebrow index="404">Not found</Eyebrow>
        <h1 className="font-display text-headline mt-8 max-w-[16ch] text-balance">
          That page doesn&rsquo;t exist.
        </h1>
        <p className="text-lead mt-6 max-w-lg text-bone-soft">
          It may have moved, or the link may be wrong. The work is all one click away.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Action href="/">Back to home</Action>
          <Action href="/contact" variant="outline">
            Contact
          </Action>
        </div>
      </Container>
    </section>
  );
}
