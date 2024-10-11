"use client"

//React/Next imports
import { useEffect } from "react";
import { useRouter } from "next/navigation";

//Components imports
import LoadingPage from "./components/shared/LoadingPage";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.push('/main');
  }, []);


  return (
    <>
      <LoadingPage />
    </>

  );
}
