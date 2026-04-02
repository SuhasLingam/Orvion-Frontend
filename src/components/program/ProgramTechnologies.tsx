"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Map technology names to their devicon CDN logo URLs
const techLogoMap: Record<string, string> = {
  // UI/UX
  "Figma": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  "FigJam": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  "Miro": "https://cdn.worldvectorlogo.com/logos/miro-2.svg",
  "Adobe XD": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg",
  "Notion": "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  "HTML/CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  // DevOps & Cloud
  "AWS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
  "Microsoft Azure": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  "Docker": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  "Kubernetes": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
  "Jenkins": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg",
  "GitHub Actions": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  "Terraform": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
  "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  // AI & Data Science
  "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "NumPy": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  "Pandas": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  "Scikit-learn": "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
  "TensorFlow": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  "PyTorch": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  "Jupyter Notebook": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
  "OpenAI APIs": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  // Cybersecurity
  "Splunk": "https://cdn.worldvectorlogo.com/logos/splunk.svg",
  "Wireshark": "https://upload.wikimedia.org/wikipedia/commons/d/df/Wireshark_icon.svg",
  "Kali Linux": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  "Nmap": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  "Burp Suite": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/burpsuite.svg",
  "Metasploit": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  "MITRE ATT&CK": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  // Quantum
  "Qiskit": "https://upload.wikimedia.org/wikipedia/commons/5/51/Qiskit-Logo.svg",
  "Cirq": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "PennyLane": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "IBM Quantum Experience": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  // New Additions (ML & Data Engineering)
  "XGBoost": "https://upload.wikimedia.org/wikipedia/commons/6/69/XGBoost_logo.png",
  "Flask/FastAPI": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  "SQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  "Apache Spark": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg",
  "Apache Airflow": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apacheairflow.svg",
  "Kafka": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg",
  "Snowflake": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/snowflake.svg",
  "AWS/Azure": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
};

export default function ProgramTechnologies({ technologies }: { technologies: string[] }) {
  return (
    <section className="w-full px-3 py-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[32px] md:text-[40px] font-extrabold text-[#0B0F19] tracking-tight mb-10"
        >
          Technologies You&apos;ll Master
        </motion.h2>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-5">
          {technologies.map((tech, i) => {
            const logoUrl = techLogoMap[tech];
            return (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group flex flex-col items-center justify-end gap-3 bg-white border border-[#DDE2EE] rounded-[18px] px-6 pt-6 pb-4 w-[130px] hover:border-[#305EFF]/40 hover:shadow-[0_8px_24px_rgba(48,94,255,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                {/* Logo circle */}
                <div className="w-12 h-12 rounded-full bg-[#F0F4FF] group-hover:bg-[#EEF2FF] flex items-center justify-center transition-colors duration-300 overflow-hidden p-2">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={tech}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#DDE5F0]" />
                  )}
                </div>
                <span
                  className="text-[13px] font-semibold text-[#0B0F19] text-center leading-tight"
                >
                  {tech}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
