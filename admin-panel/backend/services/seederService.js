const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Technology = require('../models/Technology');
const Testimonial = require('../models/Testimonial');
const Contact = require('../models/Contact');
const WebsiteContent = require('../models/WebsiteContent');
const datastore = require('./datastore');
const { getIsFallbackMode } = require('../config/db');

const initialServices = [
  {
    title: "Web Application Development",
    slug: "web-development",
    icon: "Globe",
    shortDescription: "Architecting high-concurrency, responsive, modern web applications engineered for speed, security, and global scalability.",
    detailedDescription: "Savrion builds cutting-edge enterprise web applications leveraging modern frontend frameworks, decoupled headless APIs, and cloud-native backends. We specialize in micro-frontends, responsive progressive web apps (PWAs), high-speed single-page applications, and interactive corporate portals designed to handle millions of transactions seamlessly.",
    capabilities: [
      "Enterprise Full-Stack Architecture",
      "Progressive Web Apps (PWA)",
      "High-Performance Single Page Apps (SPA)",
      "Micro-Frontend Modular Systems",
      "Real-time Websockets & Event Streaming",
      "SEO & Core Web Vitals Optimization"
    ],
    technologies: ["React.js", "Node.js", "Express", "Vite", "JavaScript", "REST APIs", "GraphQL", "Tailwind CSS"],
    status: "active",
    order: 1
  },
  {
    title: "Mobile App Development",
    slug: "mobile-development",
    icon: "Smartphone",
    shortDescription: "Delivering native-performance cross-platform iOS and Android mobile solutions with fluid animations and offline sync.",
    detailedDescription: "From consumer-facing mobile apps to internal enterprise workforce tooling, Savrion engineers fluid, high-performance mobile applications. We utilize React Native, Flutter, and native toolchains to provide continuous deployment, biometric security, offline caching, push notifications, and rich sensor integration.",
    capabilities: [
      "Cross-Platform iOS & Android Apps",
      "Offline-First Data Synchronization",
      "Native Device Hardware Integration",
      "Biometric Security & Encrypted Local Storage",
      "Push Notification & In-App Messaging Systems",
      "App Store & Google Play Deployment Automation"
    ],
    technologies: ["React Native", "Flutter", "iOS Swift", "Android Kotlin", "Firebase", "Redux", "GraphQL"],
    status: "active",
    order: 2
  },
  {
    title: "Custom Software Solutions",
    slug: "custom-software",
    icon: "Code",
    shortDescription: "Bespoke digital platforms, ERP systems, and workflow engines tailored precisely to enterprise operational workflows.",
    detailedDescription: "Off-the-shelf software rarely fits complex corporate requirements. Savrion designs and builds bespoke enterprise software platforms from the ground up. Whether modernizing legacy mainframe systems or engineering proprietary fintech algorithms, our engineering team ensures modularity, security, and scalable maintainability.",
    capabilities: [
      "Custom Enterprise Resource Planning (ERP)",
      "Automated Workflow & Business Logic Engines",
      "Legacy Codebase Modernization & Refactoring",
      "High-Security Data Ingestion Pipelines",
      "Multi-Tenant SaaS Platform Engineering",
      "Custom CRM & Internal Admin Dashboards"
    ],
    technologies: ["Node.js", "Python", "MongoDB", "PostgreSQL", "Docker", "Redis", "REST APIs"],
    status: "active",
    order: 3
  },
  {
    title: "UI/UX Design & Prototyping",
    slug: "ui-ux-design",
    icon: "Layout",
    shortDescription: "Data-driven UI/UX design, interactive prototyping, and comprehensive enterprise design systems that maximize user engagement.",
    detailedDescription: "We blend human-centered design principles with sleek corporate aesthetics. Our design team conducts deep user journey mapping, wireframing, high-fidelity clickable prototyping, usability testing, and creates multi-brand design systems with reusable token architectures.",
    capabilities: [
      "User Research & Journey Mapping",
      "Interactive High-Fidelity Wireframes",
      "Enterprise Design Systems & Token Libraries",
      "Design-to-Code Component Synchrony",
      "Accessibility (WCAG 2.1 AA) Compliance",
      "Rapid Prototype Validation & Testing"
    ],
    technologies: ["Figma", "Design Tokens", "CSS3 / SCSS", "Prototyping", "Design Systems"],
    status: "active",
    order: 4
  },
  {
    title: "Cloud Solutions & DevOps",
    slug: "cloud-solutions",
    icon: "Cloud",
    shortDescription: "Cloud architecture, zero-downtime CI/CD pipelines, Kubernetes container orchestration, and serverless infrastructure.",
    detailedDescription: "Accelerate your product release cycle with robust cloud infrastructure and automated DevOps practices. We architect fault-tolerant, multi-region cloud infrastructures across AWS, Google Cloud, and Microsoft Azure, implementing automated testing, containerization, Infrastructure as Code, and 24/7 observability.",
    capabilities: [
      "Multi-Cloud & Hybrid Cloud Architecture",
      "Continuous Integration & Continuous Delivery (CI/CD)",
      "Kubernetes & Docker Container Orchestration",
      "Infrastructure as Code (Terraform & Ansible)",
      "Serverless & Auto-Scaling Compute",
      "Real-time APM & CloudWatch Observability"
    ],
    technologies: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Nginx"],
    status: "active",
    order: 5
  },
  {
    title: "IT Consulting & Digital Strategy",
    slug: "it-consulting",
    icon: "Cpu",
    shortDescription: "Strategic technology advisory, code audits, architecture reviews, and digital transformation roadmaps for leaders.",
    detailedDescription: "Savrion advises C-suite technology leaders on strategic digital transformation, architecture modernization, and cybersecurity compliance. We audit existing software portfolios, identify performance bottlenecks, reduce cloud costs, and devise scalable technology strategies that fuel business growth.",
    capabilities: [
      "Technology Stack & Architecture Audits",
      "Legacy-to-Cloud Migration Roadmaps",
      "Cloud Cost & Performance Optimization",
      "Cybersecurity Governance & Posture Audits",
      "Engineering Team Mentorship & Agile Coaching",
      "Compliance & Data Protection Advisory"
    ],
    technologies: ["Enterprise Architecture", "Microservices", "Security Auditing", "Cloud Strategy"],
    status: "active",
    order: 6
  }
];

const initialProjects = [
  {
    title: "ApexFin: Enterprise FinTech Analytics Platform",
    slug: "apexfin-platform",
    client: "Apex Financial Holdings LLC",
    category: "FinTech & Financial Engineering",
    bannerImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "A high-frequency algorithmic financial analytics engine and trader workstation supporting real-time data streaming and multi-asset portfolio telemetry.",
    problem: "The client operated on legacy financial terminal interfaces suffering from 4-second data latency, frequent thread lockups during market volatility, and fragmented compliance reporting workflows across regulatory jurisdictions.",
    solution: "Savrion designed a distributed microservice ecosystem with a reactive React frontend and low-latency Node/Redis websocket pipelines. We integrated GPU-accelerated risk calculations, unified regulatory export feeds, and an intuitive dark-themed trader UI.",
    results: "Reduced telemetry latency by 84% (<120ms tick-to-trade), supported 50,000+ concurrent market streams, and decreased compliance report compilation time from 3 hours to 12 seconds.",
    features: [
      "Real-time bidirectional WebSocket ticker updates",
      "Multi-asset risk simulation and backtesting sandbox",
      "Decentralized ledger reconciliation engine",
      "Automated SEC/FINRA compliant audit logging",
      "Role-based multi-tier workstation authentication"
    ],
    technologies: ["React.js", "Node.js", "Express", "MongoDB", "Redis", "Docker", "WebSockets"],
    liveUrl: "https://example.com/apexfin",
    featured: true,
    status: "active",
    order: 1
  },
  {
    title: "MediPulse: Distributed Telehealth Cloud Ecosystem",
    slug: "medipulse-healthtech",
    client: "MediPulse Health Network",
    category: "HealthTech & Telemedicine",
    bannerImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "HIPAA-compliant telehealth platform connecting 120,000+ patients with certified healthcare providers via encrypted HD video and real-time biometric telemetry.",
    problem: "Outdated patient management systems led to 35% no-show rates, clinical record silos across regional clinics, and severe vulnerability risks in remote consultation streaming.",
    solution: "Savrion engineered an end-to-end encrypted telehealth portal featuring automated SMS/email reminders, EHR sync via HL7/FHIR protocols, WebRTC high-definition consultations, and interactive digital prescription dispatch.",
    results: "Reduced clinic no-show rates by 42%, achieved 100% HIPAA compliance audit pass, and handled over 450,000 virtual consultations in the first year of rollout.",
    features: [
      "End-to-end encrypted WebRTC video consultation rooms",
      "FHIR/HL7 electronic health record (EHR) bidirectional bridge",
      "Automated digital prescription generation and pharmacy dispatch",
      "Smart calendar scheduling with SMS reminders and timezone conversion",
      "Integrated secure payment processing for insurance co-pays"
    ],
    technologies: ["React.js", "Node.js", "MongoDB", "WebRTC", "AWS S3", "Express", "REST APIs"],
    liveUrl: "https://example.com/medipulse",
    featured: true,
    status: "active",
    order: 2
  },
  {
    title: "Omnitrax: AI-Powered Global Logistics Engine",
    slug: "omnitrax-supply-chain",
    client: "Omnitrax Freight Global",
    category: "Logistics & Supply Chain",
    bannerImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "An intelligent freight tracking and route optimization platform coordinating intermodal cargo containers across 42 global maritime ports.",
    problem: "Global supply chain bottlenecks and lack of real-time GPS/IoT container sensor visibility resulted in multi-million dollar port demurrage fees and unoptimized deadhead transit miles.",
    solution: "Savrion deployed a cloud-native IoT telemetry aggregator paired with predictive route optimization algorithms, driver mobile dispatch interfaces, and automated customs clearance documentation pipelines.",
    results: "Lowered fleet fuel consumption by 18%, saved $4.2M in annual demurrage penalties, and achieved 99.8% precision on container estimated time of arrival (ETA).",
    features: [
      "Live GPS & IoT temperature/humidity container telemetry",
      "Predictive machine learning routing for weather and port congestions",
      "Automated automated bill of lading and manifest generation",
      "Driver dispatch mobile app with offline map caching",
      "Interactive map overlays using Mapbox & WebGL rendering"
    ],
    technologies: ["React.js", "Node.js", "Python", "MongoDB", "AWS IoT", "Mapbox", "Docker"],
    liveUrl: "https://example.com/omnitrax",
    featured: true,
    status: "active",
    order: 3
  },
  {
    title: "CyberShield: Multi-Cloud Security Governance Suite",
    slug: "cybershield-governance",
    client: "CyberShield Technologies Inc.",
    category: "Cybersecurity & Cloud Governance",
    bannerImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Automated cloud security posture management (CSPM) platform identifying vulnerabilities, misconfigurations, and threat vectors across AWS, Azure, and GCP.",
    problem: "Managing cloud compliance across hundreds of disparate cloud accounts led to blind spots in infrastructure security and manual audit cycles that delayed release velocity.",
    solution: "Engineered an automated agentless scanner that continuously scans infrastructure configs, assesses against CIS benchmarks, and triggers automated remediation playbooks via webhooks.",
    results: "Reduced average threat remediation time from 4 days to under 15 minutes and provided continuous SOC2 / ISO27001 audit readiness.",
    features: [
      "Agentless infrastructure config scanning across multi-cloud accounts",
      "Automated remediation playbooks with rollback safeties",
      "Custom compliance rule engine supporting CIS, NIST, and SOC2",
      "Interactive topology graph visualizer for identity access risks"
    ],
    technologies: ["React.js", "Node.js", "Python", "Docker", "Kubernetes", "MongoDB"],
    liveUrl: "https://example.com/cybershield",
    featured: false,
    status: "active",
    order: 4
  }
];

const initialTechnologies = [
  { name: "React.js", category: "Frontend", icon: "Layers", proficiency: 98, status: "active", order: 1 },
  { name: "JavaScript / ESNext", category: "Frontend", icon: "Code", proficiency: 99, status: "active", order: 2 },
  { name: "Vite & Modern Tooling", category: "Frontend", icon: "Zap", proficiency: 95, status: "active", order: 3 },
  { name: "Node.js", category: "Backend", icon: "Server", proficiency: 96, status: "active", order: 4 },
  { name: "Express.js", category: "Backend", icon: "Cpu", proficiency: 97, status: "active", order: 5 },
  { name: "Python", category: "Backend", icon: "Terminal", proficiency: 92, status: "active", order: 6 },
  { name: "MongoDB & Mongoose", category: "Database", icon: "Database", proficiency: 95, status: "active", order: 7 },
  { name: "PostgreSQL", category: "Database", icon: "HardDrive", proficiency: 90, status: "active", order: 8 },
  { name: "Redis Caching", category: "Database", icon: "Zap", proficiency: 93, status: "active", order: 9 },
  { name: "React Native", category: "Mobile", icon: "Smartphone", proficiency: 92, status: "active", order: 10 },
  { name: "Flutter", category: "Mobile", icon: "Smartphone", proficiency: 88, status: "active", order: 11 },
  { name: "AWS Cloud Infrastructure", category: "Cloud", icon: "Cloud", proficiency: 94, status: "active", order: 12 },
  { name: "Docker & Containers", category: "DevOps", icon: "Box", proficiency: 96, status: "active", order: 13 },
  { name: "Kubernetes Orchestration", category: "DevOps", icon: "Network", proficiency: 89, status: "active", order: 14 },
  { name: "CI/CD Pipelines", category: "DevOps", icon: "GitBranch", proficiency: 95, status: "active", order: 15 },
  { name: "AI / Machine Learning", category: "AI/ML", icon: "Cpu", proficiency: 90, status: "active", order: 16 }
];

const initialTestimonials = [
  {
    clientName: "David Sterling",
    company: "Apex Financial Holdings",
    role: "Chief Technology Officer",
    content: "Savrion transformed our legacy trading interface into a lightning-fast enterprise workstation. Their deep technical expertise in real-time systems and clean code architecture saved us months of development time.",
    rating: 5,
    status: "active",
    order: 1
  },
  {
    clientName: "Dr. Elena Rostova",
    company: "MediPulse Health Network",
    role: "VP of Product Engineering",
    content: "The telehealth platform Savrion built surpassed every compliance and performance benchmark. They delivered on schedule, with flawless documentation and responsive communication throughout the entire engagement.",
    rating: 5,
    status: "active",
    order: 2
  },
  {
    clientName: "Marcus Vance",
    company: "Omnitrax Freight Global",
    role: "Head of Digital Operations",
    content: "Savrion's custom software solutions revolutionized how we track and optimize global maritime freight. Their engineers understand complex enterprise workflows and build systems that truly scale.",
    rating: 5,
    status: "active",
    order: 3
  },
  {
    clientName: "Sophia Patel",
    company: "NovaStream Media",
    role: "Director of Software Systems",
    content: "Exceptional frontend execution and rock-solid REST APIs. The centralized design system and attention to detail from the Savrion engineering team set a new high standard for our digital products.",
    rating: 5,
    status: "active",
    order: 4
  }
];

const seedDatabase = async () => {
  console.log('[Seeder] Starting Savrion database initialization...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@savrion.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'SavrionAdmin2026!';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  if (getIsFallbackMode()) {
    // Fallback JSON persistence
    const existingAdmin = await datastore.findOne('admins', { email: adminEmail });
    if (!existingAdmin) {
      await datastore.create('admins', {
        name: 'Savrion Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'superadmin'
      });
      console.log(`[Seeder] Seeded default admin account: ${adminEmail}`);
    }

    const existingServices = await datastore.find('services');
    if (existingServices.length === 0) {
      for (const s of initialServices) {
        await datastore.create('services', s);
      }
      console.log(`[Seeder] Seeded ${initialServices.length} default services.`);
    }

    const existingProjects = await datastore.find('projects');
    if (existingProjects.length === 0) {
      for (const p of initialProjects) {
        await datastore.create('projects', p);
      }
      console.log(`[Seeder] Seeded ${initialProjects.length} default projects.`);
    }

    const existingTech = await datastore.find('technologies');
    if (existingTech.length === 0) {
      for (const t of initialTechnologies) {
        await datastore.create('technologies', t);
      }
      console.log(`[Seeder] Seeded ${initialTechnologies.length} default technologies.`);
    }

    const existingTestimonials = await datastore.find('testimonials');
    if (existingTestimonials.length === 0) {
      for (const tm of initialTestimonials) {
        await datastore.create('testimonials', tm);
      }
      console.log(`[Seeder] Seeded ${initialTestimonials.length} default testimonials.`);
    }

    const existingContent = await datastore.findOne('content', { key: 'global_content' });
    if (!existingContent) {
      await datastore.create('content', {
        key: 'global_content',
        hero: {
          badge: 'Next-Generation Software Engineering',
          title: 'Architecting Intelligent Software Solutions for Global Enterprises',
          subtitle: 'Savrion empowers market leaders with high-performance web applications, scalable cloud infrastructure, custom software engineering, and intelligent digital systems.',
          primaryCtaText: 'Get In Touch',
          primaryCtaLink: '/contact',
          secondaryCtaText: 'Explore Services',
          secondaryCtaLink: '/services'
        },
        about: {
          title: 'Engineering the Future of Digital Innovation',
          description: 'Savrion is a premier software solutions and technology services firm dedicated to transforming ambitious ideas into secure, scalable, and high-impact digital products.',
          mission: 'To empower organizations worldwide with state-of-the-art software systems, cloud technologies, and exceptional engineering expertise.',
          vision: 'To be the most trusted technology innovation partner for businesses navigating the digital era.',
          coreValues: [
            { title: 'Engineering Excellence', description: 'Upholding uncompromising standards of code quality, scalability, and security.' },
            { title: 'Client-Centric Agility', description: 'Delivering tailored software solutions aligned strictly with enterprise goals.' },
            { title: 'Continuous Innovation', description: 'Adopting bleeding-edge frameworks, AI integrations, and cloud architectures.' }
          ]
        },
        company: {
          name: 'Savrion',
          tagline: 'Empowering Businesses Through Advanced Software Solutions',
          email: 'contact@savrion.com',
          phone: '+1 (800) 555-0199',
          address: '100 Cyber Tower, Innovation Boulevard, Suite 500, Tech City',
          socials: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com'
          }
        },
        stats: [
          { label: 'Projects Delivered', value: '150+', description: 'Across 18+ industries worldwide' },
          { label: 'Client Satisfaction', value: '99.4%', description: 'Net promoter score rating' },
          { label: 'Expert Engineers', value: '45+', description: 'Specialized architects and developers' },
          { label: 'System Uptime SLA', value: '99.99%', description: 'Enterprise reliability guarantee' }
        ]
      });
      console.log('[Seeder] Seeded default global website content.');
    }

    const existingContacts = await datastore.find('contacts');
    if (existingContacts.length === 0) {
      await datastore.create('contacts', {
        name: 'Jonathan Miller',
        email: 'jonathan@vanguardtech.io',
        phone: '+1 (555) 234-5678',
        company: 'Vanguard Technologies',
        subject: 'Custom Cloud Architecture & Microservices Ingestion',
        message: 'Hello Savrion team, we are planning to modernize our distributed payments backend and migrate to a Kubernetes-managed cloud infrastructure. We would love to discuss a prospective partnership.',
        status: 'unread'
      });
      await datastore.create('contacts', {
        name: 'Sarah Chen',
        email: 'sarah.chen@nexusecommerce.com',
        phone: '+1 (555) 987-6543',
        company: 'Nexus eCommerce Corp',
        subject: 'High-Performance React Web Application Development',
        message: 'Looking for an experienced software engineering agency to build our next-generation customer analytics portal with real-time websocket charting.',
        status: 'read'
      });
      console.log('[Seeder] Seeded sample contact enquiries.');
    }
  } else {
    // Standard Mongoose / MongoDB Seeder
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({
        name: 'Savrion Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'superadmin'
      });
      console.log(`[Seeder] Seeded MongoDB default admin account: ${adminEmail}`);
    }

    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      await Service.insertMany(initialServices);
      console.log(`[Seeder] Seeded ${initialServices.length} MongoDB services.`);
    }

    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      await Project.insertMany(initialProjects);
      console.log(`[Seeder] Seeded ${initialProjects.length} MongoDB projects.`);
    }

    const techCount = await Technology.countDocuments();
    if (techCount === 0) {
      await Technology.insertMany(initialTechnologies);
      console.log(`[Seeder] Seeded ${initialTechnologies.length} MongoDB technologies.`);
    }

    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      await Testimonial.insertMany(initialTestimonials);
      console.log(`[Seeder] Seeded ${initialTestimonials.length} MongoDB testimonials.`);
    }

    const contentCount = await WebsiteContent.countDocuments();
    if (contentCount === 0) {
      await WebsiteContent.create({
        key: 'global_content',
        hero: {
          badge: 'Next-Generation Software Engineering',
          title: 'Architecting Intelligent Software Solutions for Global Enterprises',
          subtitle: 'Savrion empowers market leaders with high-performance web applications, scalable cloud infrastructure, custom software engineering, and intelligent digital systems.',
          primaryCtaText: 'Get In Touch',
          primaryCtaLink: '/contact',
          secondaryCtaText: 'Explore Services',
          secondaryCtaLink: '/services'
        },
        about: {
          title: 'Engineering the Future of Digital Innovation',
          description: 'Savrion is a premier software solutions and technology services firm dedicated to transforming ambitious ideas into secure, scalable, and high-impact digital products.',
          mission: 'To empower organizations worldwide with state-of-the-art software systems, cloud technologies, and exceptional engineering expertise.',
          vision: 'To be the most trusted technology innovation partner for businesses navigating the digital era.',
          coreValues: [
            { title: 'Engineering Excellence', description: 'Upholding uncompromising standards of code quality, scalability, and security.' },
            { title: 'Client-Centric Agility', description: 'Delivering tailored software solutions aligned strictly with enterprise goals.' },
            { title: 'Continuous Innovation', description: 'Adopting bleeding-edge frameworks, AI integrations, and cloud architectures.' }
          ]
        },
        company: {
          name: 'Savrion',
          tagline: 'Empowering Businesses Through Advanced Software Solutions',
          email: 'contact@savrion.com',
          phone: '+1 (800) 555-0199',
          address: '100 Cyber Tower, Innovation Boulevard, Suite 500, Tech City',
          socials: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com'
          }
        },
        stats: [
          { label: 'Projects Delivered', value: '150+', description: 'Across 18+ industries worldwide' },
          { label: 'Client Satisfaction', value: '99.4%', description: 'Net promoter score rating' },
          { label: 'Expert Engineers', value: '45+', description: 'Specialized architects and developers' },
          { label: 'System Uptime SLA', value: '99.99%', description: 'Enterprise reliability guarantee' }
        ]
      });
      console.log('[Seeder] Seeded MongoDB default website content.');
    }
  }

  console.log('[Seeder] Database seeding completed successfully.');
};

module.exports = { seedDatabase };
