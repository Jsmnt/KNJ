import Header from "@/components/Header";
import QueueApp from "@/components/QueueApp";
import Rules from "@/components/Rules";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <QueueApp />
        <Rules />
      </main>
      <Footer />
    </>
  );
}
