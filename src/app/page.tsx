import Image from "next/image";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import Exams from "@/components/exams";

export default function Home() {
  return (
    <>
      <Header></Header>
      <Navbar></Navbar>
      <Exams></Exams>
    </>
  );
}
