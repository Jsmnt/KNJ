import Header from "@/components/Header";
import QueueApp from "@/components/QueueApp";
import Rules from "@/components/Rules";
import Footer from "@/components/Footer";
import { sampleItems } from "@/lib/sample-data";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <QueueApp initialItems={sampleItems} />
        <Rules />
      </main>
      <Footer />
    </>
  );
}
