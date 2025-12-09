"use client";

import {
  MouseEvent,
  useEffect,
  useState,
} from 'react';

import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Script from 'next/script';

// 1. Initialize Font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("skills"); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // State for Navigation and Typing Completion
  const [activeNav, setActiveNav] = useState("home"); 
  const [isTypingComplete, setIsTypingComplete] = useState(false); // <--- NEW STATE

  // --- TYPING EFFECT ---
  useEffect(() => {
    const fullText = "Aljon Montecalvo";
    if (!isLoading) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fullText.length) {
          setTypedText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setIsTypingComplete(true); // <--- Hides cursor when done
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // --- LOADING SCREEN ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // --- SCROLL ANIMATION OBSERVER (Fade In / Fade Out) ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add class when visible (Fade In)
          entry.target.classList.add("show-animate");
        } else {
          // Remove class when not visible (Fade Out / Reset)
          entry.target.classList.remove("show-animate");
        }
      });
    }, { threshold: 0.15 });

    const hiddenElements = document.querySelectorAll(".hidden-animate");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isLoading]);

  // --- ACTIVE NAVIGATION OBSERVER ---
  useEffect(() => {
    const sections = document.querySelectorAll("section[id], div[id='home']");

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    }, { threshold: 0.5 }); 

    sections.forEach((section) => navObserver.observe(section));

    return () => navObserver.disconnect();
  }, [isLoading]);


  // --- VIDEO HOVER HANDLER ---
  const handleMouseEnter = async (e: MouseEvent<HTMLVideoElement>) => {
    try {
      await e.currentTarget.play();
    } catch (error) {
      console.log("Video play interrupted", error);
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLVideoElement>) => {
    e.currentTarget.pause();
    e.currentTarget.currentTime = 0;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark text-gold">
        <div className="w-16 h-16 border-4 border-card border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

return (
    <main className={`relative overflow-x-hidden bg-dark text-light ${poppins.variable} font-sans scroll-smooth selection:bg-gold selection:text-dark`}>
      <Script src="https://kit.fontawesome.com/3d7bb0d906.js" crossOrigin="anonymous" />

      {/* Global Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] opacity-30"></div>
      </div>

      {/* --- HEADER --- */}
      <header id="header" className="relative w-full h-screen">
        
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-dark/70 backdrop-blur-md border-b border-white/5 transition-all duration-300">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="w-[120px] relative hover:opacity-80 transition-opacity">
               <Image 
                 src="/Pictures/Logo.png" 
                 alt="AM Logo" 
                 width={140} 
                 height={50} 
                 className="w-full h-auto object-contain"
                 priority 
               />
            </div>

            {/* DESKTOP MENU */}
            <ul className="hidden lg:flex gap-10">
              {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => {
                const isActive = activeNav === item.toLowerCase();
                
                return (
                    <li key={item}>
                    <a 
                        href={`#${item.toLowerCase()}`} 
                        className={`text-sm font-medium uppercase tracking-wider transition-colors relative group py-2 
                        ${isActive ? 'text-gold' : 'text-light/80 hover:text-gold'}`}
                    >
                        {item}
                        <span className={`absolute left-0 bottom-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full box-shadow-glow 
                        ${isActive ? 'w-full' : 'w-0'}`}></span>
                    </a>
                    </li>
                );
              })}
            </ul>

            {/* HAMBURGER ICON */}
            <button 
                onClick={() => setIsMenuOpen(true)} 
                className="lg:hidden text-2xl text-gold focus:outline-none hover:rotate-90 transition-transform duration-300"
                aria-label="Open Menu"
            >
                <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-[60] bg-dark/95 backdrop-blur-xl transform transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-3xl text-gold hover:rotate-90 transition-transform duration-300">
                <i className="fa-solid fa-xmark"></i>
            </button>
            <ul className="flex flex-col items-center justify-center h-full gap-8">
                {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => {
                    const isActive = activeNav === item.toLowerCase();
                    return (
                        <li key={item}>
                            <a 
                                href={`#${item.toLowerCase()}`} 
                                className={`text-4xl font-bold transition-colors tracking-tight 
                                ${isActive ? 'text-gold' : 'text-light hover:text-gold'}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                            {item}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>

        {/* Hero Content */}
        <div id="home" className="container mx-auto h-full flex flex-col justify-center relative z-10">
          
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-gold/10 blur-[100px] -z-10 rounded-full"></div>

          <div className="max-w-4xl hidden-animate">
            <div className="inline-block px-4 py-2 border border-gold/30 rounded-full bg-gold/5 backdrop-blur-sm mb-6">
                <p className="text-gold tracking-[0.2em] text-xs md:text-sm font-semibold uppercase">Web & Software Developer</p>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 font-poppins">
              Hi, I&apos;m&nbsp;<br className="md:hidden" />
              <span className="bg-gradient-to-r from-gold via-yellow-200 to-gold bg-clip-text text-transparent whitespace-nowrap bg-[length:200%_auto] animate-shine">
                {typedText}
              </span>
              
              {/* EDIT: Cursor only renders if typing is NOT complete */}
              {!isTypingComplete && <span className="cursor-blink text-gold"></span>}
            
            </h1>
            
            <p className="text-lg md:text-xl text-grey mb-10 max-w-2xl leading-relaxed font-light">
              Building robust web and software solutions from Consolacion, Cebu.
            </p>
            
            <a href="/CV/Montecalvo_Resume.pdf" download className="group relative inline-flex items-center justify-center px-10 py-4 font-medium text-dark transition-all duration-300 bg-gold rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(238,193,141,0.6)]">
                <span className="mr-2">Download Resume</span>
                <i className="fa-solid fa-arrow-down group-hover:translate-y-1 transition-transform"></i>
            </a>
          </div>
        </div>
      </header>

     {/* --- ABOUT --- */}
      <section id="about" className="py-24 relative">
        <div className="container mx-auto flex flex-wrap lg:flex-nowrap gap-16 items-start">
          
          <div className="w-full lg:w-[25%] hidden-animate" style={{ transitionDelay: '200ms' }}>
             <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 group">
                 <div className="absolute inset-0 bg-gold/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                 
                 <Image 
                   src="/Pictures/aaa.png" 
                   alt="Aljon Profile"
                   width={0}
                   height={0}
                   sizes="100vw"
                   className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                 />
             </div>
          </div>

          <div className="w-full lg:w-[70%] hidden-animate" style={{ transitionDelay: '400ms' }}>
            <h2 className="text-4xl md:text-5xl font-bold text-light mb-6">About <span className="text-gold">Me</span></h2>
            <p className="text-grey text-lg leading-relaxed mb-10 font-light">
              Hello! 👋 I&apos;m a dedicated web developer passionate about crafting digital experiences that make an impact. With a creative mindset and a knack for problem-solving, I bring a unique blend of technical skill and design thinking.
            </p>

            <div className="flex gap-8 border-b border-white/10 mb-10 overflow-x-auto">
              {['skills', 'education','certificates'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-lg capitalize font-medium transition-all relative whitespace-nowrap ${activeTab === tab ? "text-gold" : "text-grey hover:text-light"}`}
                  >
                    {tab}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-gold shadow-[0_0_10px_#eec18d] transition-all duration-300 ${activeTab === tab ? "w-full" : "w-0"}`}></span>
                  </button>
              ))}
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'skills' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 animate-fadeIn">
                        {[
                          { title: "Web Development", skills: "HTML, CSS, JavaScript, Vue.JS, TailwindCSS, PHP, React" },
                          { title: "Backend", skills: "Java, SQL, Node.js, Laravel, ASP.NET" },
                          { title: "AI Prompting", skills: "ChatGPT, Gemini, DeepSeek" },
                          { title: "Logical Thinking", skills: "Analyzing, Debugging, Problem Solving" },
                          { title: "No Code Platforms", skills: "Wix and WordPress" },
                          { title: "Cloud Databases", skills: "Firebase and Supabase" },
                          { title: "Hardware & Networking", skills: "Reformat, Hardware Repair, Configuration" }
                        ].map((skill, idx) => (
                          <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-gold/30 transition-colors">
                              <h4 className="text-gold font-semibold mb-1">{skill.title}</h4>
                              <p className="text-sm text-grey font-light">{skill.skills}</p>
                          </div>
                        ))}
                    </div>
                )}
                {activeTab === 'education' && (
                    <div className="space-y-8 animate-fadeIn border-l-2 border-white/10 pl-8 ml-2 relative">
                        {[
                          { year: "August 2025", title: "Studied Computer System Servicing", loc: "Rosemont Hills Montessori Danao Campus" },
                          { year: "2022 - Present", title: "Bachelor of Science in Information Technology", loc: "Cebu Technological University Danao Campus" },
                          { year: "2020 - 2022", title: "Information Communication Technology Strand", loc: "Informatics College" }
                        ].map((edu, idx) => (
                          <div key={idx} className="relative">
                            <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-dark border-2 border-gold"></span>
                            <span className="text-gold text-sm font-semibold tracking-wider">{edu.year}</span>
                            <h4 className="text-light text-xl font-medium mt-1">{edu.title}</h4>
                            <p className="text-grey italic mt-1 font-light">{edu.loc}</p>
                          </div>
                        ))}
                    </div>
                )}
                {activeTab === 'certificates' && (
                    <div className="grid gap-6 animate-fadeIn">
                        {[
                          { year: "2024", title: "Completed the Introduction to SQL in SoloLearn", sub: "" },
                          { year: "2023", title: "Completed the CodeChum Basic C Programming", sub: "Cebu Technological University Danao Campus" },
                          { year: "2020", title: "Best in C Programming 1 & 2", sub: "Informatics College" }
                        ].map((cert, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/5">
                             <div className="text-gold text-2xl"><i className="fa-solid fa-certificate"></i></div>
                             <div>
                                <span className="text-xs text-gold border border-gold/30 px-2 py-1 rounded mb-2 inline-block">{cert.year}</span>
                                <h4 className="text-light text-lg font-medium">{cert.title}</h4>
                                {cert.sub && <p className="text-grey italic text-sm mt-1">{cert.sub}</p>}
                             </div>
                          </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section id="services" className="py-24 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 hidden-animate">
            <h2 className="text-4xl md:text-5xl font-bold text-light mb-4">My <span className="text-gold">Services</span></h2>
            <p className="text-grey max-w-xl mx-auto">High-quality web and software solutions tailored to your needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "fa-code", title: "Full-Stack Web Dev", desc: "Building dynamic, responsive web applications using React, Vue.js, Laravel, and Node.js." },
              { icon: "fa-server", title: "Backend & Database", desc: "Designing secure, scalable server architectures and managing data with SQL, Firebase, and Supabase." },
              { icon: "fa-layer-group", title: "CMS & No-Code", desc: "Rapid website deployment and management using WordPress and Wix for fast, professional results." },
              { icon: "fa-wand-magic-sparkles", title: "AI Integration", desc: "Leveraging AI tools like ChatGPT, Gemini, and DeepSeek to enhance workflows and write efficient code." },
              { icon: "fa-screwdriver-wrench", title: "IT & Hardware Support", desc: "Providing technical support for hardware repair, PC reformatting, and network/router configuration." },
              { icon: "fa-bug", title: "Debugging & Consulting", desc: "Analyzing complex technical problems and optimizing existing codebases for better performance." }
            ].map((service, index) => (
              <div 
                key={index} 
                className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-gold/50 hover:bg-white/10 transition-all duration-300 group hidden-animate backdrop-blur-sm"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <i className={`fa-solid ${service.icon} text-3xl text-gold`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-light">{service.title}</h3>
                <p className="text-grey text-sm leading-relaxed font-light group-hover:text-light/90">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PORTFOLIO --- */}
      <section id="portfolio" className="py-24 bg-black/20">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-light mb-12 hidden-animate">Featured <span className="text-gold">Work</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "CTU DANAO SHOP", desc: "JavaScript Logic", video: "/Video/ctudanaoApparel.mp4" },
              { title: "Inventory Management System", desc: "CSS Grid & Flexbox", video: "/Video/IMS.mp4" },
              { title: "Smart Campus", desc: "Game Development", video: "/Video/SmartCampus.mp4" },
              { title: "CTU DANAO NEWS", desc: "Game Development", video: "/Video/CTUNEWS.mp4" }
            ].map((work, index) => (
              <div key={index} className="relative aspect-video rounded-2xl overflow-hidden group border border-white/10 hidden-animate shadow-lg" style={{ transitionDelay: `${index * 150}ms` }}>
                
                <div className="absolute inset-0 bg-card flex items-center justify-center z-0">
                    <i className="fa-solid fa-play text-white/20 text-5xl"></i>
                </div>
                
                <video 
                  muted loop playsInline preload="metadata"
                  className="relative z-10 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <source src={`${work.video}#t=0.1`} type="video/mp4" />
                </video>
                
                <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 backdrop-blur-[2px]">
                  <h3 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{work.title}</h3>
                  <p className="text-gold text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 uppercase tracking-wider">{work.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
              <a href="https://github.com/MontecalvoAm" target="_blank" className="inline-block border border-white/20 text-light px-10 py-3 rounded-full hover:border-gold hover:text-gold transition-all duration-300 uppercase tracking-widest text-sm font-semibold hover:shadow-[0_0_15px_rgba(238,193,141,0.3)]">
                See More on GitHub
              </a>
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contact" className="py-24">
        <div className="container mx-auto flex flex-wrap lg:flex-nowrap gap-16">
          <div className="w-full lg:w-1/3 hidden-animate">
            <h2 className="text-4xl md:text-5xl font-bold text-light mb-6">Let&apos;s <span className="text-gold">Connect</span></h2>
            <p className="text-grey mb-10 font-light text-lg">Have a project in mind? Feel free to reach out for collaborations or just a friendly hello!</p>
            
            <div className="space-y-6">
                <div className="flex items-center gap-6 text-light group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-dark transition-all duration-300"><i className="fa-solid fa-paper-plane text-xl"></i></div>
                    <span className="text-lg">aljon.montecalvo08@gmail.com</span>
                </div>
                <div className="flex items-center gap-6 text-light group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-dark transition-all duration-300"><i className="fa-solid fa-phone text-xl"></i></div>
                    <span className="text-lg">+63 993 588 3771</span>
                </div>
            </div>

            <div className="mt-12 flex gap-4">
               {['facebook', 'instagram', 'github'].map(social => (
                   <a key={social} href="#" className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-grey hover:border-gold hover:bg-gold hover:text-dark hover:-translate-y-1 transition-all duration-300 shadow-lg">
                       <i className={`fa-brands fa-${social} text-xl`}></i>
                   </a>
               ))}
            </div>
          </div>

          <div className="w-full lg:w-2/3 hidden-animate" style={{ transitionDelay: '200ms' }}>
            <form action="https://api.web3forms.com/submit" method="POST" className="bg-white/5 p-10 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-md">
               <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <input type="text" name="Name" placeholder="Your Name" required className="w-full bg-black/20 border border-white/10 p-4 text-light rounded-xl focus:outline-none focus:border-gold/50 focus:bg-black/40 transition-all" />
                   <input type="email" name="Email" placeholder="Your Email" required className="w-full bg-black/20 border border-white/10 p-4 text-light rounded-xl focus:outline-none focus:border-gold/50 focus:bg-black/40 transition-all" />
               </div>
               <textarea name="Message" rows={6} placeholder="Your Message" className="w-full bg-black/20 border border-white/10 p-4 mb-8 text-light rounded-xl focus:outline-none focus:border-gold/50 focus:bg-black/40 transition-all resize-none"></textarea>
               <button type="submit" className="w-full md:w-auto bg-gold text-dark font-bold px-12 py-4 rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(238,193,141,0.5)] transition-all duration-300 transform hover:-translate-y-1">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="w-full text-center py-8 border-t border-white/5 text-grey text-sm bg-black/40">
        <p>Copyright © 2025 Aljon Bajenting Montecalvo. Made in Consolacion.</p>
      </footer>
    </main>
  );
}