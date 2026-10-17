export default function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="
        fixed
        inset-0
        pointer-events-none
        opacity-10
        z-20
      "
      style={{
        backgroundImage: `
          radial-gradient(circle, #fff 1px, transparent 1px)
        `,
        backgroundSize: "6px 6px",
      }}
    />
  );
}