import Image from "next/image";

import ChatIcon from "@mui/icons-material/Chat";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full flex bg-surface">
      <section className="shrink w-1/2 h-full rounded-r-xl overflow-hidden hidden relative lg:block">
        <Image
          src={"/images/background-auth.png"}
          alt={"background image"}
          width={1938}
          height={1098}
          className="w-full h-full object-cover scale-105"
        />
      </section>
      <section className="flex-1 flex flex-col gap-4 justify-start lg:justify-center px-4 pt-8 lg:pl-[7.5rem] mx-auto lg:mx-0">
        <div className="flex gap-3 items-center">
          <ChatIcon
            strokeWidth={3}
            className="text-primary !w-8 !h-8"
          />
          <p className="font-poppins text-primary font-bold text-3xl">
            CONVERSE E DESCUBRA
          </p>
        </div>
        <div className="lg:min-h-[27.5rem] min-h-[88vh] overflow-y-auto">
          {children}
        </div>
      </section>
    </div>
  );
}
