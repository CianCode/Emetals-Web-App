import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Emetals</h1>
      <p className="mt-4 text-lg">
        Buy gold, silver, platinum, and palladium with live pricing.
      </p>
      <Image
        src="/emetals_gold_ingot.png"
        alt="Emetals Gold Ingot"
        width={400}
        height={400}
      />
    </main>
  );
}
