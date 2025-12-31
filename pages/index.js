import { useEffect, useState } from "react";
import {
  Menu,
  Play,
  PenTool,
  MonitorPlay,
  Camera,
  CheckCircle2,
  Send,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function ArrowDzignPortfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "Graphic Design",
    message: "",
  });

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterProjects = (category) => {
    setActiveFilter(category);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendToWhatsapp = (e) => {
    e.preventDefault();
    const text = `*New Inquiry from Website*%0a%0a*Name:* ${formData.name}%0a*Email:* ${formData.email}%0a*Project:* ${formData.project}%0a*Message:* ${formData.message}`;
    window.open(`https://wa.me/918866922651?text=${text}`, "_blank");
  };

  const mapCategory = (cat) => {
    if (cat === "graphic-design") return "graphic";
    if (cat === "video-edits") return "video";
    if (cat === "photography") return "photo";
    return "all";
  };

  const portfolioItems = projects.map((p) => ({
    id: p.id || p._id,
    category: mapCategory(p.category),
    img: p.coverImageUrl || p.coverImage,
    type:
      p.category === "graphic-design"
        ? "Graphic Design"
        : p.category === "video-edits"
        ? "Video Editing"
        : "Photography",
    title: p.title,
    hasPlay: p.media?.type === "video",
    description: p.description,
    images: p.imagesUrls || p.images || [],
    mediaUrl: p.mediaUrl || p.media?.url,
  }));

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        const data = await response.json();
        console.log('Fetched projects:', data);
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();

    // Optional: Poll for updates every 30 seconds
    const interval = setInterval(fetchProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleProjectClick = (item) => {
    setSelectedProject(item);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <style>{`
        :root {
          --brand-yellow: #f9a310;
          --brand-red: #9e0506;
          --brand-white: #ffffff;
          --brand-black: #000000;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--brand-black);
          color: var(--brand-white);
          overflow-x: hidden;
        }
      `}</style>

      <nav className="fixed w-full z-50 py-4 backdrop-blur-md bg-black/50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="block w-40 relative z-50">
            <img
              src="Horizontal.png"
              alt="ArrowDzign"
              className="w-full object-contain"
            />
          </a>

          <div className="hidden md:flex space-x-8 items-center relative z-50 mt-6">
            <a
              href="#home"
              className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-[#f9a310] transition-colors"
            >
              Home
            </a>
            <a
              href="#portfolio"
              className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-[#f9a310] transition-colors"
            >
              Portfolio
            </a>
            <a
              href="#services"
              className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-[#f9a310] transition-colors"
            >
              Services
            </a>
            <a
              href="#testimonials"
              className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-[#f9a310] transition-colors"
            >
              Reviews
            </a>
            <a
              href="#contact"
              className="px-5 py-2 border border-[#f9a310]/50 text-[#f9a310] hover:bg-[#f9a310] hover:text-black transition-all rounded text-xs uppercase font-bold tracking-widest"
            >
              Hire Me
            </a>
          </div>

          <button
            className="md:hidden text-white relative z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-black border-b border-gray-800 p-6 flex flex-col space-y-6 shadow-2xl">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-white"
            >
              Home
            </a>
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-white"
            >
              Portfolio
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-white"
            >
              Services
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-white"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#f9a310] font-bold text-xl"
            >
              Contact Me
            </a>
          </div>
        )}
      </nav>

      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block mb-6 px-4 py-1 border border-[#f9a310]/30 rounded-full bg-[#f9a310]/10">
            <span className="text-[#f9a310] text-xs font-bold tracking-[0.2em] uppercase">
              Digital Artist
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-none">
            CRAFTING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">
              VISUAL LEGACIES
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Merging the precision of graphic design with the emotional rhythm of
            filmmaking. Based in Surat, creating globally.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <a
              href="#portfolio"
              className="px-8 py-4 bg-[#f9a310] hover:bg-[#9e0506] text-black hover:text-white font-bold tracking-wide rounded transition-all w-full md:w-auto"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border border-white/20 hover:bg-white/10 text-white font-medium tracking-wide rounded transition-all w-full md:w-auto flex items-center justify-center gap-2"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </section>

      <div className="bg-neutral-900/50 border-y border-gray-800">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-bold text-white">2.5</h3>
            <p className="text-[#f9a310] uppercase tracking-widest text-xs">
              Years Experience
            </p>
          </div>
          <div className="text-center md:text-left md:border-l border-gray-800 md:pl-8">
            <h3 className="text-4xl font-bold text-white">Surat</h3>
            <p className="text-[#f9a310] uppercase tracking-widest text-xs">
              Based in Gujarat
            </p>
          </div>
          <div className="text-center md:text-left md:border-l border-gray-800 md:pl-8">
            <h3 className="text-4xl font-bold text-white">100%</h3>
            <p className="text-[#f9a310] uppercase tracking-widest text-xs">
              Client Satisfaction
            </p>
          </div>
        </div>
      </div>

      <section id="portfolio" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                Selected Works
              </h2>
              <div className="h-1 w-20 bg-[#f9a310]"></div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === "all"
                    ? "bg-white text-black"
                    : "bg-[#1a1a1a] text-gray-400 hover:bg-[#f9a310] hover:text-black"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("graphic")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === "graphic"
                    ? "bg-white text-black"
                    : "bg-[#1a1a1a] text-gray-400 hover:bg-[#f9a310] hover:text-black"
                }`}
              >
                Graphic Design
              </button>
              <button
                onClick={() => setActiveFilter("video")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === "video"
                    ? "bg-white text-black"
                    : "bg-[#1a1a1a] text-gray-400 hover:bg-[#f9a310] hover:text-black"
                }`}
              >
                Video Editing
              </button>
              <button
                onClick={() => setActiveFilter("photo")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === "photo"
                    ? "bg-white text-black"
                    : "bg-[#1a1a1a] text-gray-400 hover:bg-[#f9a310] hover:text-black"
                }`}
              >
                Photography
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems
              .filter((item) =>
                activeFilter === "all" || item.category === activeFilter
              )
              .map((item, index) => (
                <div
                  key={item.id || index}
                  onClick={() => handleProjectClick(item)}
                  className="group relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.img}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    alt={item.title}
                  />
                  {item.hasPlay && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-[#f9a310]/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="fill-black text-black ml-1 w-5 h-5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent pointer-events-none">
                    <span className="text-[#f9a310] text-xs font-bold uppercase">
                      {item.type}
                    </span>
                    <h3 className="text-white font-bold text-lg mt-1">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
          </div>

          {portfolioItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No projects found. Add some from the admin panel!</p>
            </div>
          )}
        </div>
      </section>

      <section id="services" className="py-24 bg-neutral-900/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center text-white">
            Multidisciplinary Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-800 bg-black/50 rounded-2xl hover:border-[#f9a310] transition-all group">
              <PenTool className="text-[#f9a310] w-10 h-10 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">
                Graphic Design
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Logo, Brand Identity, Brand Guidelines, Social Media Post,
                Visiting Card, Letterhead, Carousel, Photo Color Correction,
                Instagram Story, Thumbnails, Brochure.
              </p>
            </div>
            <div className="p-8 border border-gray-800 bg-black/50 rounded-2xl hover:border-[#f9a310] transition-all group">
              <MonitorPlay className="text-[#f9a310] w-10 h-10 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">
                Video Editing
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Social Media Reel, Documentary Edit, Highlight, Teaser.
              </p>
            </div>
            <div className="p-8 border border-gray-800 bg-black/50 rounded-2xl hover:border-[#f9a310] transition-all group">
              <Camera className="text-[#f9a310] w-10 h-10 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">
                Photography
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Natural candid clicks as an emotional observer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center text-white">
            Client Words
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 border-l-2 border-[#f9a310] bg-gray-900/20">
              <p className="text-gray-300 italic mb-6 text-lg">
                "Yash didn't just edit our video; he found the story we were
                trying to tell. The cinematic grading was next level."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">
                  R
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Rahul M.</p>
                  <p className="text-gray-500 text-xs uppercase">
                    Fashion Brand
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border-l-2 border-[#f9a310] bg-gray-900/20">
              <p className="text-gray-300 italic mb-6 text-lg">
                "The brand identity ArrowDzign created for us completely changed
                how our customers see us. Professional and visionary."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">
                  S
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Sneha P.</p>
                  <p className="text-gray-500 text-xs uppercase">
                    Startup Founder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-neutral-900/30">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-white">
              I am a <span className="text-[#f9a310]">Digital Artist</span>{" "}
              driven by narrative.
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              In a world saturated with content, technical skill isn't enough.
              You need a vision. My journey started with graphic design,
              obsessing over grid systems. That discipline evolved into video
              editing—adding the dimension of time.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="text-[#f9a310] w-5 h-5" />
                <span>Adobe Creative Suite Master (Pr, Ae, Ps, Ai)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="text-[#f9a310] w-5 h-5" />
                <span>Cinematography & Lighting Theory</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="art.jpg"
                alt="Yash Prajapati"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 border-t border-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Let's Create Together
          </h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Ready to elevate your brand? I am available for freelance projects.
            <br />
            Email:{" "}
            <a
              href="mailto:workwithyash.in@gmail.com"
              className="text-[#f9a310] hover:underline"
            >
              workwithyash.in@gmail.com
            </a>
          </p>

          <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-2xl relative z-50">
            <div className="space-y-6 text-left">
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full bg-black border border-gray-800 text-white rounded py-3 px-4 focus:outline-none focus:border-[#f9a310]"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full bg-black border border-gray-800 text-white rounded py-3 px-4 focus:outline-none focus:border-[#f9a310]"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Project Type
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleFormChange}
                  className="w-full bg-black border border-gray-800 text-white rounded py-3 px-4 focus:outline-none focus:border-[#f9a310]"
                >
                  <option>Graphic Design</option>
                  <option>Video Editing</option>
                  <option>iPhone Videography</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Tell me about your vision..."
                  value={formData.message}
                  onChange={handleFormChange}
                  className="w-full bg-black border border-gray-800 text-white rounded py-3 px-4 focus:outline-none focus:border-[#f9a310]"
                ></textarea>
              </div>
              <button
                onClick={sendToWhatsapp}
                className="w-full bg-[#f9a310] hover:bg-white text-black font-bold py-4 rounded transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Send to WhatsApp
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-8 mt-12 mb-8 relative z-50">
            <a
              href="https://instagram.com/arrowdzign"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-white transition-colors flex items-center justify-center w-10 h-10"
            >
              <Instagram className="w-6 h-6" />
            </a>

            <a
              href="#"
              className="text-gray-400 hover:text-white text-white transition-colors flex items-center justify-center w-10 h-10"
            >
              <Linkedin className="w-6 h-6" />
            </a>

            <a
              href="https://www.behance.net/arrowdzign"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "-45px", marginTop: "2px" }}
              className="flex items-center justify-center"
            >
              <img
                src="/Behances.png"
                className="w-32 h-auto object-contain"
                alt="Behance"
              />
            </a>
          </div>

          <p className="text-gray-600 text-sm">
            &copy; 2025 arrowdzign. All Rights Reserved. <br />
            Designed & Developed by arrowdzign productions.
          </p>
        </div>
      </section>

      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-6">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-[#f9a310]"
          >
            ✕
          </button>

          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">
              {selectedProject.title}
            </h2>

            {selectedProject.description && (
              <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
                {selectedProject.description}
              </p>
            )}

            {/* Show video if available */}
            {selectedProject.hasPlay && selectedProject.mediaUrl && (
              <div className="mb-8">
                <video
                  controls
                  className="w-full rounded-lg"
                  src={selectedProject.mediaUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Show images */}
            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedProject.images.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-lg group">
                    <img
                      src={img}
                      alt={`${selectedProject.title} - Image ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}