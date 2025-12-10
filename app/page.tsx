"use client";

import { MouseEvent, useEffect, useState } from 'react';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Script from 'next/script';

// 1. Font Configuration
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export default function Home() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("skills");
  const [skillsPage, setSkillsPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("home");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  // ADDED: State for the Video Lightbox
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

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
          setIsTypingComplete(true);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // --- LOADING SCREEN ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- SCROLL ANIMATION ---
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // This matches the @utility opacity-100 in your CSS
          entry.target.classList.add("opacity-100");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll(".reveal-on-scroll");
    hiddenElements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading]);

  // --- NAV HIGHLIGHTER ---
  useEffect(() => {
    const sections = document.querySelectorAll("section[id], div[id='home']");
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    }, { threshold: 0.3 });

    sections.forEach((section) => navObserver.observe(section));
    return () => navObserver.disconnect();
  }, [isLoading]);

  // --- VIDEO HANDLERS ---
  const handleMouseEnter = async (e: MouseEvent<HTMLVideoElement>) => {
    try { await e.currentTarget.play(); } catch (error) { console.log(error); }
  };
  const handleMouseLeave = (e: MouseEvent<HTMLVideoElement>) => {
    e.currentTarget.pause();
    e.currentTarget.currentTime = 0;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark text-gold">
        <div className="relative">
            <div className="w-20 h-20 border-t-4 border-b-4 border-gold rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-r-4 border-l-4 border-white/20 rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  return (
    <main className={`relative w-full overflow-x-hidden bg-dark text-light ${poppins.variable} font-sans selection:bg-gold selection:text-dark`}>
      <Script src="https://kit.fontawesome.com/3d7bb0d906.js" crossOrigin="anonymous" />

      {/* --- BACKGROUND GLOWS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] bg-gold/5 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute top-[40%] -right-[10%] w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[100px]"></div>
         <div className="absolute -bottom-[10%] left-[20%] w-[30vw] h-[30vw] bg-purple-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-dark/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="w-32 hover:scale-105 transition-transform duration-300">
             <h1 className="text-2xl font-bold tracking-tighter text-white">AM<span className="text-gold">.</span></h1>
          </div>

          <ul className="hidden lg:flex items-center gap-8">
            {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => {
              const isActive = activeNav === item.toLowerCase();
              return (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} 
                      className={`text-sm font-medium uppercase tracking-widest transition-all duration-300 relative group py-2
                      ${isActive ? 'text-gold' : 'text-grey hover:text-white'}`}>
                      {item}
                      <span className={`absolute left-0 -bottom-1 h-[2px] bg-gold transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-1/3'}`}></span>
                  </a>
                </li>
              );
            })}
          </ul>

          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-2xl text-gold hover:text-white transition-colors">
             <i className="fa-solid fa-bars-staggered"></i>
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU --- */}
      <div className={`fixed inset-0 z-[60] bg-dark/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
         <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-4xl text-grey hover:text-gold hover:rotate-90 transition-all">
            <i className="fa-solid fa-xmark"></i>
         </button>
         {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)}
               className="text-4xl font-bold text-white hover:text-gold transition-colors tracking-tighter">
               {item}
            </a>
         ))}
      </div>

      {/* --- HERO SECTION --- */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl reveal-on-scroll">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm hover:border-gold/30 transition-colors">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-xs font-medium uppercase tracking-widest text-gold">Available for work</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
              Hi, I&apos;m <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold animate-gradient-x">
                {typedText}
              </span>
              {!isTypingComplete && <span className="text-gold animate-pulse">|</span>}
            </h1>

            <p className="text-lg md:text-xl text-grey mb-10 max-w-2xl leading-relaxed font-light">
              Crafting robust web solutions and aesthetic software experiences from <span className="text-white font-normal">Consolacion, Cebu</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/CV/Montecalvo_Resume.pdf" download className="px-8 py-4 bg-gold text-dark font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] text-center">
                Download Resume <i className="fa-solid fa-download ml-2"></i>
              </a>
              <a href="#portfolio" className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:border-gold hover:text-gold hover:bg-white/5 transition-all duration-300 text-center">
                View Work
              </a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
           <span className="text-xs uppercase tracking-widest text-grey">Scroll</span>
           <i className="fa-solid fa-chevron-down text-gold"></i>
        </div>
      </section>

{/* --- ABOUT SECTION (UPDATED WITH PAGINATION) --- */}
<section id="about" className="py-24 relative bg-black/20">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-16 items-start">
          
          <div className="w-full lg:w-1/3 reveal-on-scroll group perspective">
             <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-card shadow-2xl transform transition-transform duration-500 group-hover:rotate-1 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gold/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                {/* Placeholders for Image */}
                <div className="aspect-[4/5] bg-neutral-800 relative">
                  <Image 
                      src="/Pictures/aaa.png" 
                      alt="Profile" 
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
             </div>
          </div>

          <div className="w-full lg:w-2/3 reveal-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About <span className="text-gold">Me</span></h2>
            <p className="text-grey text-lg leading-relaxed mb-10 font-light border-l-2 border-gold/30 pl-6">
              I blend technical expertise with creative design thinking. As an IT student at CTU Danao, I focus on building scalable applications that solve real-world problems while looking beautiful.
            </p>

            <div className="flex flex-wrap gap-4 mb-10 p-1 bg-white/5 rounded-xl w-fit backdrop-blur-sm border border-white/5">
              {['skills', 'education', 'certificates'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer
                  ${activeTab === tab ? "bg-gold text-dark shadow-lg" : "text-grey hover:text-white hover:bg-white/5"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
                {activeTab === 'skills' && (() => {
                  // --- PAGINATION LOGIC START ---
                  const ALL_SKILLS = [
                      { t: "Web Development", s: "HTML, CSS, JavaScript, Vue.JS, TailwindCSS, PHP, React" },
                      { t: "Backend", s: "Laravel, Node.js" },
                      { t: "Database", s: "MySQL, Firebase, Supabase" },
                      { t: "AI PROMPTING", s: "ChatGPT, Gemini, DeepSeek" },
                      { t: "Tools", s: "VS Code, Figma, Cursor" },
                      { t: "Version Control", s: "Git, GitHub" },
                      { t: "Logical Thinking", s: "Analyzing, Debugging, Breaking down complex problems" },
                      { t: "Basic Skills of No Code Platform", s: "Wix and WordPress" },
                      { t: "Hardware", s: "Networking, Repair, Configuration" },
                  ];
                  
                  const itemsPerPage = 6;
                  const totalPages = Math.ceil(ALL_SKILLS.length / itemsPerPage);
                  const currentSkills = ALL_SKILLS.slice((skillsPage - 1) * itemsPerPage, skillsPage * itemsPerPage);
                  // --- PAGINATION LOGIC END ---

                  return (
                    <div className="animate-fadeIn">
                      {/* Grid for Skills */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentSkills.map((item, i) => (
                          <div key={i} className="bg-card p-6 rounded-xl border border-white/5 hover:border-gold/30 transition-all hover:translate-x-1 group">
                             <h4 className="text-gold font-bold text-lg mb-1 group-hover:text-white transition-colors">{item.t}</h4>
                             <p className="text-grey text-sm">{item.s}</p>
                          </div>
                        ))}
                      </div>

                      {/* Pagination Controls (Only shows if more than 6 items) */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-white/5">
                            <button 
                              onClick={() => setSkillsPage(p => Math.max(1, p - 1))}
                              disabled={skillsPage === 1}
                              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gold hover:text-dark disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-grey transition-all"
                            >
                              <i className="fa-solid fa-chevron-left"></i> Prev
                            </button>

                            <span className="text-sm text-grey font-medium">
                               Page <span className="text-gold">{skillsPage}</span> of {totalPages}
                            </span>

                            <button 
                              onClick={() => setSkillsPage(p => Math.min(totalPages, p + 1))}
                              disabled={skillsPage === totalPages}
                              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gold hover:text-dark disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-grey transition-all"
                            >
                              Next <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {activeTab === 'education' && (
                  <div className="space-y-8 pl-4 border-l border-white/10 animate-fadeIn">
                    {[
                        { y: "2022 - Present", t: "BS Information Technology", s: "CTU Danao Campus" },
                        { y: "2020 - 2022", t: "Information Communication Technology Strand", s: "Informatics College" }
                    ].map((e, i) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute -left-[21px] top-1 w-3 h-3 bg-gold rounded-full shadow-[0_0_10px_#D4AF37]"></div>
                          <span className="text-xs text-gold border border-gold/20 px-2 py-1 rounded bg-gold/5">{e.y}</span>
                          <h3 className="text-xl font-medium text-white mt-2">{e.t}</h3>
                          <p className="text-grey">{e.s}</p>
                        </div>
                    ))}
                  </div>
                )}

                {activeTab === 'certificates' && (
                   <div className="grid gap-4 animate-fadeIn">
                      {[
                        "Introduction to SQL - SoloLearn (2024)",
                        "Basic C Programming - CodeChum (2023)",
                        "Best in Programming - Informatics (2020)"
                      ].map((c, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                           <i className="fa-solid fa-medal text-gold text-xl"></i>
                           <span className="text-light font-medium">{c}</span>
                        </div>
                      ))}
                   </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section id="services" className="py-24">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16 reveal-on-scroll">
              <span className="text-gold uppercase tracking-widest text-sm font-semibold">What I Offer</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2">My Services</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                 { icon: "fa-code", t: "Web Development", d: "Modern, responsive websites using Next.js and React." },
                 { icon: "fa-database", t: "Backend Systems", d: "Secure APIs and database management with SQL & Laravel." },
                 { icon: "fa-robot", t: "AI Integration", d: "Implementing ChatGPT & Gemini APIs into applications." },
                 { icon: "fa-wordpress", t: "CMS Solutions", d: "Rapid deployment using WordPress & Wix." },
                 { icon: "fa-server", t: "IT Support", d: "Hardware repair, networking, and technical troubleshooting." },
                 { icon: "fa-bug", t: "Consulting", d: "Code debugging, optimization, and logic analysis." },
              ].map((s, i) => (
                 <div key={i} className="group p-8 bg-card rounded-2xl border border-white/5 hover:border-gold/30 hover:bg-white/5 transition-all duration-300 reveal-on-scroll hover:-translate-y-2">
                    <div className="w-14 h-14 bg-dark rounded-xl flex items-center justify-center text-2xl text-gold mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                       <i className={`fa-solid ${s.icon}`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors">{s.t}</h3>
                    <p className="text-grey leading-relaxed text-sm">{s.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- PORTFOLIO (UPDATED WITH CLICK EVENT & MODAL) --- */}
      {/* --- PORTFOLIO --- */}
      <section id="portfolio" className="py-24 bg-gradient-to-b from-dark to-black relative">
        <div className="container mx-auto px-6">
           {/* Header - Removed the link from here */}
           <div className="mb-12 reveal-on-scroll text-center md:text-left">
               <h2 className="text-4xl md:text-5xl font-bold">Featured <span className="text-gold">Projects</span></h2>
               <p className="text-grey mt-2">Selected works from my academic and personal journey.</p>
           </div>

           {/* Video Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "CTU Shop", tag: "E-Commerce Logic", vid: "/Video/ctudanaoApparel.mp4" },
                { title: "Inventory System", tag: "Management Dashboard", vid: "/Video/IMS.mp4" },
                { title: "Smart Campus", tag: "Smart Campus System", vid: "/Video/SmartCampus.mp4" },
                { title: "CTU News", tag: "Interactive Media", vid: "/Video/CTUNEWS.mp4" }
              ].map((project, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveVideo(project.vid)}
                  className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-card reveal-on-scroll shadow-2xl cursor-pointer"
                >
                   <video 
                     muted loop playsInline 
                     className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                     onMouseEnter={handleMouseEnter} 
                     onMouseLeave={handleMouseLeave}
                   >
                     <source src={`${project.vid}#t=0.1`} type="video/mp4" />
                   </video>

                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none"></div>

                   <div className="absolute bottom-0 left-0 p-8 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-xs font-bold text-gold uppercase tracking-wider mb-2 block">{project.tag}</span>
                      <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                   </div>

                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-16 h-16 bg-gold/90 rounded-full flex items-center justify-center text-dark text-2xl backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                         <i className="fa-solid fa-play ml-1"></i>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* ADDED: Bottom Center GitHub Button */}
           <div className="flex justify-center mt-12 reveal-on-scroll">
              <a 
                href="https://github.com/MontecalvoAm" 
                target="_blank" 
                className="px-8 py-4 bg-gold text-dark font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
              >
                 View GitHub <i className="fa-brands fa-github text-xl"></i>
              </a>
           </div>
        </div>

        {/* --- VIDEO MODAL (Focus View) --- */}
        {activeVideo && (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
              onClick={() => setActiveVideo(null)}
            >
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white text-4xl transition-colors z-[101]"
              >
                &times;
              </button>

              <div 
                className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <video 
                  src={activeVideo} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
        )}
      </section>

      {/* --- CONTACT (FIXED TEXT ERRORS) --- */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute -right-20 top-20 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
           <div className="bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row gap-12 reveal-on-scroll">
              
              <div className="w-full lg:w-1/3 space-y-8">
                 {/* FIX: Used &apos; instead of ' */}
                 <h2 className="text-4xl font-bold">Let&apos;s work <br /><span className="text-gold">together.</span></h2>
                 <p className="text-grey">I&apos;m currently available for freelance work and internship opportunities.</p>
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold"><i className="fa-solid fa-envelope"></i></div>
                       <span className="text-light">aljon.montecalvo08@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold"><i className="fa-solid fa-phone"></i></div>
                       <span className="text-light">+63 993 588 3771</span>
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                      {[
                        { icon: 'facebook', link: 'https://www.facebook.com/aljon.montecalvo08' },
                        { icon: 'instagram', link: 'https://www.instagram.com/ajonjonnn/' },
                        { icon: 'github', link: 'https://github.com/MontecalvoAm' },
                        { icon: 'linkedin', link: 'https://www.instagram.com/ajonjonnn/' }
                      ].map((social, index) => (
                        <a 
                          key={index} 
                          href={social.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-grey hover:bg-gold hover:text-dark hover:border-gold transition-all duration-300"
                        >
                          <i className={`fa-brands fa-${social.icon} text-lg`}></i>
                        </a>
                      ))}
                    </div>
                  </div>

              <div className="w-full lg:w-2/3">
                 <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
                    <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs uppercase text-grey tracking-wider font-semibold">Name</label>
                          <input type="text" name="Name" required className="w-full bg-dark/50 border border-white/10 p-4 rounded-xl focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 text-white transition-all" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs uppercase text-grey tracking-wider font-semibold">Email</label>
                          <input type="email" name="Email" required className="w-full bg-dark/50 border border-white/10 p-4 rounded-xl focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 text-white transition-all" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs uppercase text-grey tracking-wider font-semibold">Message</label>
                       <textarea name="Message" rows={4} className="w-full bg-dark/50 border border-white/10 p-4 rounded-xl focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 text-white transition-all resize-none"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-gold text-dark font-bold py-4 rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">
                       Send Message
                    </button>
                 </form>
              </div>

           </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 text-center text-grey text-sm bg-dark border-t border-white/5">
        <p>© 2025 Aljon Montecalvo. All rights reserved.</p>
      </footer>
    </main>
  );
}