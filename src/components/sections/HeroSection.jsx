const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPnr6b_xan6sAKV9kA-15uUeMZncyryCnmoLP6S8OR95RlZeuRk-4ze5eCCvoIKq2gqFzGzjWBh0Ix5odJB2VKVNx-XkC98pM402HfItRHpb4UUWJUxBcAO3Dui7WaaMc7E4Glj-msFHjkPgNni3vC9cfguTwGiOodfDrDD99Jbwcs1jBVnQominkuZpDhbcpnuhdswsb2DWNtPiwOyZZ-EKQAj3DyfYuA0pv2LzbpnK6D34OAgnjfOXKe5uWJvVoirUfxt8Rm_OKk'

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0 scale-105">
        <img
          src={HERO_IMAGE}
          alt="Contemporary abstract artwork"
          className="w-full h-full object-cover filter brightness-[0.97]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
      </div>
      <div className="relative z-10 text-center px-6 max-w-6xl">
        <h1 className="font-headline text-4xl sm:text-6xl md:text-[8rem] lg:text-[10rem] leading-none tracking-tight text-primary">
          The Fluid Geometry <br className="hidden sm:block" /> of Silence
        </h1>
      </div>
    </section>
  )
}
