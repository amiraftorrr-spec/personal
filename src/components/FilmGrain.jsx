export default function FilmGrain() {
  return (
    <div
      className="
        fixed
        inset-0
        pointer-events-none
        opacity-10
        z-30
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