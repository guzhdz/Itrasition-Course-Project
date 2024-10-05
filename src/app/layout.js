import localFont from "next/font/local";
import "./globals.css";

//Provider imports
import ChackraUIProvider from "./providers/ChakraUIProvider";
import { UIProvider } from "./context/UIContext";
import { AuthProvider } from "./context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Course Project",
  description: "Itrasition Course Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ChackraUIProvider>
          <UIProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </UIProvider>
        </ChackraUIProvider>
      </body>
    </html>
  );
}
