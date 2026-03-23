export type Program = {
  id: string;
  title: string;
  titleHighlight: string;
  description: string;
  duration: string;
  level: string;
  mode: string;
  highlights: string[];
  technologies: string[];
  outcomes: string[];
  responsibilities: string[];
};

export const programs: Program[] = [
  {
    id: "ui-ux-design",
    title: "UI/UX",
    titleHighlight: "Design",
    description: "Master design thinking, user research, and industry-standard tools to craft beautiful, intuitive digital experiences.",
    duration: "12 weeks",
    level: "Beginner",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["Figma", "FigJam", "Miro", "Adobe XD", "Notion", "HTML/CSS"],
    outcomes: [
      "Master end-to-end design workflows from research to high-fidelity prototyping",
      "Develop deep empathy for users through qualitative and quantitative research",
      "Create accessible, responsive, and platform-specific UI systems",
      "Build a professional portfolio with 3+ real-world case studies",
    ],
    responsibilities: [
      "Conduct comprehensive user research and summarize usability findings",
      "Design wireframes, mockups, and highly interactive prototypes",
      "Collaborate with engineering teams to ensure pixel-perfect handoffs",
      "Maintain and expand central design systems and component libraries",
    ],
  },
  {
    id: "devops-cloud",
    title: "DevOps &",
    titleHighlight: "Cloud",
    description: "Build, deploy, and scale modern applications with the most in-demand cloud and DevOps toolchain used in top companies.",
    duration: "16 weeks",
    level: "Intermediate",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["AWS", "Microsoft Azure", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "Git"],
    outcomes: [
      "Design and deploy scalable, fault-tolerant cloud infrastructure on AWS",
      "Master Git and modern CI/CD pipelines to automate software delivery",
      "Containerize applications and orchestrate them using Kubernetes",
      "Implement Infrastructure as Code (IaC) using Terraform for reliable environments",
    ],
    responsibilities: [
      "Provision and securely manage cloud infrastructure components",
      "Monitor system health, automate backups, and optimize resource usage",
      "Resolve deployment bottlenecks in CI/CD pipeline workflows",
      "Implement container security and auto-scaling policies",
    ],
  },
  {
    id: "ai-data-science",
    title: "AI & Data",
    titleHighlight: "Science",
    description: "From data wrangling to deep learning — build real-world AI models using cutting edge frameworks and OpenAI APIs.",
    duration: "20 weeks",
    level: "Intermediate",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["Python", "NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "Jupyter Notebook", "OpenAI APIs"],
    outcomes: [
      "Clean, explore, and visualize complex datasets to extract actionable insights",
      "Build, train, and optimize predictive machine learning models",
      "Develop deep neural networks for computer vision and natural language processing",
      "Integrate LLMs and OpenAI APIs into robust production applications",
    ],
    responsibilities: [
      "Clean, normalize, and pre-process massive datasets for model training",
      "Optimize existing algorithms to improve predictive accuracy and speed",
      "Develop REST endpoints to securely serve machine learning models",
      "Design dashboards to visualize training metrics and data drift",
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    titleHighlight: "(Splunk)",
    description: "Learn offensive and defensive security techniques used by real security engineers to protect modern systems.",
    duration: "16 weeks",
    level: "Intermediate",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["Splunk", "Wireshark", "Kali Linux", "Nmap", "Burp Suite", "Metasploit", "MITRE ATT&CK"],
    outcomes: [
      "Conduct comprehensive vulnerability assessments and penetration tests",
      "Monitor, detect, and respond to security incidents using Splunk SIEM",
      "Analyze network traffic and identify malicious patterns using Wireshark",
      "Implement strong defensive measures based on the MITRE ATT&CK framework",
    ],
    responsibilities: [
      "Actively monitor Splunk SIEM dashboards for anomalous behavior",
      "Perform weekly vulnerability scans and triage risk priorities",
      "Conduct post-mortem analysis on simulated security incidents",
      "Audit cloud configurations and identity access management policies",
    ],
  },
  {
    id: "quantum-computing",
    title: "Quantum",
    titleHighlight: "Computing",
    description: "Step into the future — understand quantum algorithms and build circuits using the world's leading quantum platforms.",
    duration: "12 weeks",
    level: "Advanced",
    mode: "Live Sessions",
    highlights: [
      "Live instructor-led sessions",
      "1-on-1 mentorship",
      "Real-world projects",
      "Career guidance",
    ],
    technologies: ["Qiskit", "Cirq", "PennyLane", "Python", "IBM Quantum Experience"],
    outcomes: [
      "Understand the core principles of quantum mechanics, qubits, and entanglement",
      "Design and simulate complex quantum circuits using Qiskit and IBM Quantum",
      "Implement foundational quantum algorithms like Shor's and Grover's",
      "Explore real-world quantum use cases in cryptography and optimization",
    ],
    responsibilities: [
      "Translate classical logic into efficient quantum gate sequences",
      "Run and test algorithms on cloud-based quantum hardware simulators",
      "Analyze error rates, decoherence, and noise in quantum circuits",
      "Research applications of quantum machine learning and cryptography",
    ],
  },
];

export function getProgramById(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}
